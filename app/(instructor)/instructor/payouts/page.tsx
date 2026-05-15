import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { getInstructorBalance } from "@/lib/revenue"
import { PayoutClient } from "./_components/payout-client"

export default async function InstructorPayoutsPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId || session?.user?.role !== "INSTRUCTOR") {
    return redirect("/")
  }

  const {
    totalRevenue,
    totalPaidOut,
    totalPending,
    availableBalance
  } = await getInstructorBalance(userId)

  // Get payout history
  const payouts = await prisma.payout.findMany({
    where: { instructorId: userId },
    orderBy: { createdAt: "desc" }
  })


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
