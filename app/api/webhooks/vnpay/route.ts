import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyVNPayHash } from "@/lib/vnpay"
import { sendOrderSuccessEmail } from "@/lib/mail"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const params: any = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })

    const isValidHash = verifyVNPayHash(params)
    if (!isValidHash) {
      return NextResponse.json({ RspCode: "97", Message: "Invalid signature" })
    }

    const orderId = params["vnp_TxnRef"]
    const responseCode = params["vnp_ResponseCode"]
    const amount = parseInt(params["vnp_Amount"]) / 100
    const transactionNo = params["vnp_TransactionNo"]

    // BUG-20 FIX: Idempotency check - Prevent processing the same transaction twice
    if (transactionNo) {
        const existingEvent = await prisma.webhookEvent.findUnique({
            where: { eventId: transactionNo }
        })
        if (existingEvent) {
            return NextResponse.json({ RspCode: "00", Message: "Order already confirmed" })
        }
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true }
    })

    if (!order) {
      return NextResponse.json({ RspCode: "01", Message: "Order not found" })
    }

    if (order.totalAmount !== amount) {
      return NextResponse.json({ RspCode: "04", Message: "Invalid amount" })
    }

    if (order.status !== "PENDING") {
      return NextResponse.json({ RspCode: "02", Message: "Order already confirmed" })
    }

    if (responseCode === "00") {
      // Payment Success
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: { status: "PAID" }
        })

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

        if (order.couponId) {
            await tx.coupon.update({
                where: { id: order.couponId },
                data: { usedCount: { increment: 1 } }
            })
            // Use upsert for idempotency
            await tx.couponUsage.upsert({
                where: { userId_couponId: { userId: order.userId, couponId: order.couponId } },
                update: {},
                create: {
                    userId: order.userId,
                    couponId: order.couponId
                }
            })
        }

        // Log Webhook Event for Idempotency
        if (transactionNo) {
            await tx.webhookEvent.create({
                data: {
                    provider: "vnpay",
                    eventId: transactionNo,
                    payload: params as any
                }
            })
        }
      })

      if (order.user.email) {
        await sendOrderSuccessEmail(order.user.email, order.id, order.totalAmount)
      }

      return NextResponse.json({ RspCode: "00", Message: "Confirm Success" })
    } else {
      // Payment Failed
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" }
      })
      return NextResponse.json({ RspCode: "00", Message: "Confirm Success (Payment Failed)" })
    }
  } catch (error) {
    console.error("VNPay IPN Error:", error)
    return NextResponse.json({ RspCode: "99", Message: "Unknown error" })
  }
}