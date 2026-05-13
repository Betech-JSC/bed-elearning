import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { SePayClient } from "./sepay-client"

export default async function SePayPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const order = await prisma.order.findFirst({
    where: { 
        id: orderId,
        userId: session.user.id
    },
    include: {
      items: {
        include: {
          course: true
        }
      }
    }
  })

  if (!order) redirect("/checkout")
  if (order.status === "PAID") {
    redirect(`/checkout/success?orderId=${order.id}`)
  }

  const bankId = process.env.SEPAY_BANK_ID || "MB"
  const accountNo = process.env.SEPAY_ACCOUNT_NO || "0000123456789"
  const accountName = process.env.SEPAY_ACCOUNT_NAME || "VIBECODE ACADEMY"
  
  // Create a unique message for tracking
  // SePay works best with a code like VIBE12345
  const paymentMsg = `VIBE${order.id.slice(-6).toUpperCase()}`

  const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${order.totalAmount}&addInfo=${paymentMsg}&accountName=${accountName}`

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <SePayClient 
        orderId={order.id}
        qrUrl={qrUrl}
        amount={order.totalAmount}
        message={paymentMsg}
        bankName={bankId}
        accountNo={accountNo}
        accountName={accountName}
      />
    </div>
  )
}
