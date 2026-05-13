import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { PayoutClient } from "./_components/payout-client"

export default async function InstructorPayoutsPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId || session?.user?.role !== "INSTRUCTOR") {
    return redirect("/")
  }

  // Calculate instructor revenue
  // We'll calculate 70% of all purchased courses where the instructor is the author
  const paidOrderItems = await prisma.orderItem.findMany({
    where: {
      order: { status: "PAID" },
      course: { instructorId: userId }
    },
    include: { course: true }
  })

  const totalRevenue = paidOrderItems.reduce((acc, item) => acc + (item.price * 0.7), 0)

  // Get payout history
  const payouts = await prisma.payout.findMany({
    where: { instructorId: userId },
    orderBy: { createdAt: "desc" }
  })

  const totalPaidOut = payouts
    .filter(p => p.status === "PAID")
    .reduce((acc, p) => acc + p.amount, 0)
    
  const totalPending = payouts
    .filter(p => p.status === "PENDING")
    .reduce((acc, p) => acc + p.amount, 0)

  const availableBalance = totalRevenue - totalPaidOut - totalPending


  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black">Doanh thu & Rút tiền</h1>
        <p className="text-zinc-500">Quản lý thu nhập từ các khóa học của bạn và yêu cầu rút tiền.</p>
      </div>
      
      <PayoutClient 
        totalRevenue={totalRevenue}
        availableBalance={availableBalance}
        totalPaidOut={totalPaidOut}
        payouts={payouts}
      />
    </div>
  )
}
