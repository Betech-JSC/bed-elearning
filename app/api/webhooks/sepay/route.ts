import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sendOrderSuccessEmail } from "@/lib/mail"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("[SEPAY_WEBHOOK]", body)

    const { content, transferAmount, referenceCode } = body

    if (!content) {
      return new NextResponse("Missing content", { status: 400 })
    }

    // Find order by paymentCode (transfer content)
    const order = await prisma.order.findUnique({
      where: { paymentCode: content.trim().toUpperCase() },
      include: {
        user: true,
        items: {
          include: { course: true }
        }
      }
    })

    if (!order) {
      console.error(`[SEPAY_ERROR] Order not found for code: ${content}`)
      return new NextResponse("Order not found", { status: 404 })
    }

    // BUG-10 FIX: OrderStatus enum không có COMPLETED — chỉ check PAID
    if (order.status === "PAID") {
      return new NextResponse("Order already processed", { status: 200 })
    }

    // BUG-08 FIX: Strict amount validation — không xử lý nếu chuyển thiếu tiền
    if (transferAmount === undefined || transferAmount === null) {
      console.error(`[SEPAY_ERROR] Missing transferAmount for order ${order.id}`)
      return new NextResponse("Missing transfer amount", { status: 400 })
    }

    if (transferAmount < order.totalAmount) {
      console.error(
        `[SEPAY_ERROR] Amount mismatch for order ${order.id}. Expected ${order.totalAmount}, got ${transferAmount}`
      )
      // Không xử lý — từ chối thanh toán thiếu
      return NextResponse.json(
        { message: `Số tiền không hợp lệ. Cần ${order.totalAmount}, nhận ${transferAmount}.` },
        { status: 400 }
      )
    }

    // Idempotency: kiểm tra xem event này đã được xử lý chưa
    if (referenceCode) {
      const existingEvent = await prisma.webhookEvent.findUnique({
        where: { eventId: referenceCode }
      })
      if (existingEvent) {
        return new NextResponse("Event already processed", { status: 200 })
      }
    }

    // Update Order Status trong transaction
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paymentId: referenceCode || "SEPAY_TRANSFER"
        }
      })

      // Enroll user in courses
      for (const item of order.items) {
        await tx.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: order.userId,
              courseId: item.courseId
            }
          },
          update: {},
          create: {
            userId: order.userId,
            courseId: item.courseId
          }
        })
      }

      // Update coupon usage nếu có
      if (order.couponId) {
        await tx.coupon.update({
          where: { id: order.couponId },
          data: { usedCount: { increment: 1 } }
        })
        // Dùng upsert để tránh duplicate (BUG-21 analog)
        await tx.couponUsage.upsert({
          where: { userId_couponId: { userId: order.userId, couponId: order.couponId } },
          update: {},
          create: { userId: order.userId, couponId: order.couponId }
        })
      }

      // Log idempotency event
      if (referenceCode) {
        await tx.webhookEvent.create({
          data: {
            provider: "sepay",
            eventId: referenceCode,
            payload: body as any
          }
        })
      }
    })

    // Send confirmation email
    if (order.user.email) {
      await sendOrderSuccessEmail(order.user.email, order.id, order.totalAmount)
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error: any) {
    console.error("[SEPAY_WEBHOOK_ERROR]", error)
    // BUG-09 FIX: Không expose stack trace ra ngoài
    return NextResponse.json({ message: "Internal Error" }, { status: 500 })
  }
}
