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

  // Get last used bank info for auto-fill
  const lastBankInfo = payouts.find(p => p.bankInfo && p.bankInfo.trim().length > 0)?.bankInfo || ""

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">Doanh thu & Rút tiền</h1>
        <p className="text-zinc-500 font-medium text-sm">Quản lý thu nhập từ các khóa học của bạn và gửi yêu cầu thanh toán nhanh chóng.</p>
      </div>
      
      <PayoutClient 
        totalRevenue={totalRevenue}
        availableBalance={availableBalance}
        totalPaidOut={totalPaidOut}
        payouts={payouts}
        lastBankInfo={lastBankInfo}
      />
    </div>
  )
}
