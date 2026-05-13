import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"
import Stripe from "stripe"
import { sendOrderSuccessEmail } from "@/lib/mail"

export async function POST(req: Request) {
  const body = await req.text()
  const headerList = await headers()
  const signature = headerList.get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const orderId = session?.metadata?.orderId
    const userId = session?.metadata?.userId

    if (!orderId || !userId) {
      return new NextResponse("Webhook Error: Missing metadata", { status: 400 })
    }

    // Check if event already processed
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId: event.id }
    })

    if (existingEvent) {
      return new NextResponse("Event already processed", { status: 200 })
    }

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      })

      if (!order || order.status === "PAID") {
        return new NextResponse("Order already paid or not found", { status: 200 })
      }

      await prisma.$transaction(async (tx) => {
        // Update Order
        await tx.order.update({
          where: { id: orderId },
          data: { status: "PAID" }
        })

        // Create Enrollments
        for (const item of order.items) {
          await tx.enrollment.upsert({
            where: {
              userId_courseId: {
                userId,
                courseId: item.courseId
              }
            },
            create: {
              userId,
              courseId: item.courseId
            },
            update: {}
          })
        }

        // Update Coupon Usage
        if (order.couponId) {
          await tx.coupon.update({
            where: { id: order.couponId },
            data: { usedCount: { increment: 1 } }
          })
          
          await tx.couponUsage.create({
            data: {
              userId,
              couponId: order.couponId
            }
          })
        }

        // Log Event
        await tx.webhookEvent.create({
          data: {
            provider: "stripe",
            eventId: event.id,
            payload: event as any
          }
        })
      })

      // Send confirmation email
      const orderWithUser = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true }
      })

      if (orderWithUser?.user.email) {
        await sendOrderSuccessEmail(
          orderWithUser.user.email,
          orderWithUser.id,
          orderWithUser.totalAmount
        )
      }

      return new NextResponse("Success", { status: 200 })
    } catch (error) {
      console.error("Stripe webhook processing error:", error)
      return new NextResponse("Webhook processing failed", { status: 500 })
    }
  }

  return new NextResponse("Unhandled event type", { status: 200 })
}
