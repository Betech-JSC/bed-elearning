import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { createVNPayUrl } from "@/lib/vnpay"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const user = session?.user

    if (!user?.id) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 })
    }

    const { items, couponCode, paymentMethod } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Giỏ hàng trống" }, { status: 400 })
    }

    // Fetch courses to get prices and check availability
    const courses = await prisma.course.findMany({
      where: {
        id: { in: items },
        status: "PUBLISHED"
      }
    })

    if (courses.length !== items.length) {
      return NextResponse.json({ message: "Một số khóa học không còn khả dụng" }, { status: 400 })
    }

    // Check if user already enrolled in any of these
    const existingEnrollments = await prisma.enrollment.findMany({
      where: {
        userId: user.id,
        courseId: { in: items }
      }
    })

    if (existingEnrollments.length > 0) {
      return NextResponse.json({ message: "Bạn đã sở hữu một số khóa học trong giỏ hàng" }, { status: 400 })
    }

    // Calculate totals
    const subtotal = courses.reduce((acc, c) => acc + (c.salePrice > 0 ? c.salePrice : c.price), 0)
    let discount = 0
    let couponId = null

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { 
            code: couponCode.toUpperCase(), 
            isActive: true,
            // BUG-33 FIX: Check expiry date in query
            OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } }
            ]
        }
      })

      if (coupon) {
        // Double check max uses
        if (coupon.usedCount < coupon.maxUses) {
            if (coupon.type === "FIXED") {
                discount = Math.min(coupon.value, subtotal)
            } else {
                discount = Math.min((subtotal * coupon.value) / 100, subtotal * 0.9) // Max 90% discount
            }
            couponId = coupon.id
        }
      }
    }

    const totalAmount = Math.max(0, subtotal - discount)

    // BUG-05 FIX: Handle Free Course Enrollment Flow (totalAmount = 0)
    if (totalAmount === 0) {
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                subtotal,
                discount,
                totalAmount: 0,
                couponId,
                status: "PAID", // Auto mark as paid for free
                paymentMethod: "STRIPE", // Just as placeholder
                items: {
                    create: courses.map(c => ({
                        courseId: c.id,
                        price: c.salePrice > 0 ? c.salePrice : c.price
                    }))
                }
            }
        })

        // Enroll user immediately
        await prisma.$transaction(async (tx) => {
            for (const c of courses) {
                await tx.enrollment.upsert({
                    where: { userId_courseId: { userId: user.id, courseId: c.id } },
                    update: {},
                    create: { userId: user.id, courseId: c.id }
                })
            }
            if (couponId) {
                await tx.coupon.update({
                    where: { id: couponId },
                    data: { usedCount: { increment: 1 } }
                })
                await tx.couponUsage.create({
                    data: { userId: user.id, couponId }
                })
            }
        })

        return NextResponse.json({ url: `/checkout/success?orderId=${order.id}` })
    }

    // Create Order in DB for paid courses
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        subtotal,
        discount,
        totalAmount,
        couponId,
        paymentMethod,
        items: {
          create: courses.map(c => ({
            courseId: c.id,
            price: c.salePrice > 0 ? c.salePrice : c.price
          }))
        }
      }
    })

    // Handle Stripe
    if (paymentMethod === "STRIPE") {
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: courses.map(c => {
          const itemPrice = c.salePrice > 0 ? c.salePrice : c.price
          // BUG-15 FIX: Proportional discount handling
          const proportionalPrice = Math.round(itemPrice * (1 - (discount / subtotal)))
          
          return {
            price_data: {
              currency: "vnd",
              product_data: {
                name: c.title,
              },
              unit_amount: proportionalPrice,
            },
            quantity: 1,
          }
        }),
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failed?orderId=${order.id}`,
        metadata: {
          orderId: order.id,
          userId: user.id
        }
      })

      await prisma.order.update({
        where: { id: order.id },
        data: { paymentId: stripeSession.id }
      })

      return NextResponse.json({ url: stripeSession.url })
    }

    // Handle VNPay
    if (paymentMethod === "VNPAY") {
      const ipAddr = req.headers.get("x-forwarded-for") || "127.0.0.1"
      const vnpayUrl = createVNPayUrl({
        amount: totalAmount,
        orderId: order.id,
        ipAddr,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/vnpay-return`
      })

      await prisma.order.update({
        where: { id: order.id },
        data: { paymentId: order.id } 
      })

      return NextResponse.json({ url: vnpayUrl })
    }

    // Handle SePay
    if (paymentMethod === "SEPAY") {
      const paymentCode = `VIBE${order.id.slice(-6).toUpperCase()}`
      
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentCode }
      })

      return NextResponse.json({ 
        url: `/checkout/sepay/${order.id}` 
      })
    }

    return NextResponse.json({ message: "Phương thức thanh toán không hợp lệ" }, { status: 400 })

  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ message: "Lỗi hệ thống khi thanh toán" }, { status: 500 })
  }
}
