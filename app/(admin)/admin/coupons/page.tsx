import prisma from "@/lib/prisma"
import { CouponList } from "@/components/admin/coupons/coupon-list"
import { CreateCouponButton } from "@/components/admin/coupons/create-coupon-button"

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { usages: true }
      }
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Quản lý mã giảm giá</h1>
          <p className="text-zinc-500">Tạo mới và quản lý các chương trình khuyến mãi.</p>
        </div>
        <CreateCouponButton />
      </div>

      <CouponList coupons={coupons} />
    </div>
  )
}
