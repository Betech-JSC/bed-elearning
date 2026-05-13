import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyVNPayHash } from "@/lib/vnpay"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const params = Object.fromEntries(searchParams.entries())
  
  const isValid = verifyVNPayHash(params)
  
  if (!isValid) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout/failed?message=InvalidSignature`)
  }

  const orderId = params['vnp_TxnRef']
  const responseCode = params['vnp_ResponseCode']
  const transactionNo = params['vnp_TransactionNo']

  if (responseCode === '00') {
    // Success
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true, coupon: true }
      })

      if (!order) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout/failed?message=OrderNotFound`)
      }

      if (order.status === 'PAID') {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${orderId}`)
      }

      // Check if already processed by IPN
      if (transactionNo) {
          const existingEvent = await prisma.webhookEvent.findUnique({
              where: { eventId: transactionNo }
          })
          if (existingEvent) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${orderId}`)
          }
      }

      // Start transaction to update order and create enrollments
      await prisma.$transaction(async (tx) => {
        // Update Order
        await tx.order.update({
          where: { id: orderId },
          data: { status: 'PAID' }
        })

        // Create Enrollments
        for (const item of order.items) {
          await tx.enrollment.upsert({
            where: {
              userId_courseId: {
                userId: order.userId,
                courseId: item.courseId
              }
            },
            create: {
              userId: order.userId,
              courseId: item.courseId
            },
            update: {} 
          })
        }

        // Update Coupon Usage if exists
        if (order.couponId) {
          await tx.coupon.update({
            where: { id: order.couponId },
            data: { usedCount: { increment: 1 } }
          })
          
          // BUG-21 FIX: Use upsert for CouponUsage to prevent duplicate key errors
          await tx.couponUsage.upsert({
            where: { userId_couponId: { userId: order.userId, couponId: order.couponId } },
            update: {},
            create: {
              userId: order.userId,
              couponId: order.couponId
            }
          })
        }
        
        // Log Webhook Event
        if (transactionNo) {
            await tx.webhookEvent.create({
                data: {
                    provider: 'vnpay',
                    eventId: transactionNo,
                    payload: params as any
                }
            })
        }
      })

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${orderId}`)
    } catch (error) {
      console.error("VNPay return error:", error)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout/failed?message=ProcessingError`)
    }
  } else {
    // Failed or Cancelled
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout/failed?orderId=${orderId}&code=${responseCode}`)
  }
}
