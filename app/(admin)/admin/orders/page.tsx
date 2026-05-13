import prisma from "@/lib/prisma"
import { OrderTable } from "@/components/admin/orders/order-table"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true }
      },
      items: {
        include: {
          course: { select: { title: true } }
        }
      }
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black mb-2 tracking-tight">Quản lý đơn hàng</h1>
        <p className="text-zinc-500">Theo dõi giao dịch, xử lý hoàn tiền và quản lý trạng thái thanh toán.</p>
      </div>

      <OrderTable orders={orders} />
    </div>
  )
}
