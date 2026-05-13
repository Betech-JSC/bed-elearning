import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { AdminPayoutClient } from "./_components/admin-payout-client"

export default async function AdminPayoutsPage() {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return redirect("/")
  }

  const payouts = await prisma.payout.findMany({
    include: {
      instructor: true
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black">Quản lý Yêu cầu rút tiền</h1>
        <p className="text-zinc-500">Xem và xử lý các yêu cầu rút tiền từ giảng viên.</p>
      </div>
      
      <AdminPayoutClient payouts={payouts} />
    </div>
  )
}
