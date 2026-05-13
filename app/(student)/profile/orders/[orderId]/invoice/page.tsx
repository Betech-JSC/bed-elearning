import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Printer, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default async function InvoicePage({
  params
}: {
  params: { orderId: string }
}) {
  const session = await auth()
  if (!session?.user?.id) return redirect("/login")

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      user: true,
      items: {
        include: { course: true }
      },
      coupon: true
    }
  })

  if (!order || order.userId !== session.user.id) {
    return notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Action Bar (Hide when printing) */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Link href="/profile" className={cn(buttonVariants({ variant: "ghost" }), "gap-2")}>
          <ArrowLeft className="w-4 h-4" />
          Quay lại hồ sơ
        </Link>
        <Button onClick={() => window.print()} className="gap-2 bg-zinc-900 hover:bg-zinc-800">
          <Printer className="w-4 h-4" />
          In hóa đơn
        </Button>
      </div>

      {/* Invoice Content */}
      <div className="bg-white dark:bg-zinc-950 border rounded-3xl p-12 shadow-xl print:shadow-none print:border-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b pb-8">
          <div>
            <h1 className="text-3xl font-black text-blue-600 mb-2">VIBECODE ACADEMY</h1>
            <p className="text-sm text-zinc-500">Học lập trình thực chiến cùng chuyên gia</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase tracking-widest">Hóa đơn điện tử</h2>
            <p className="font-mono text-zinc-500 uppercase mt-1">#{order.orderNumber.slice(-12)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">Thông tin khách hàng</h3>
            <div className="space-y-1">
              <p className="font-bold text-lg">{order.user.name}</p>
              <p className="text-zinc-500">{order.user.email}</p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">Thông tin thanh toán</h3>
            <div className="space-y-1">
              <p className="font-medium">Ngày: {format(new Date(order.createdAt), "dd MMMM, yyyy", { locale: vi })}</p>
              <p className="font-medium uppercase">Phương thức: {order.paymentMethod}</p>
              <p className="flex items-center md:justify-end gap-1 text-green-600 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Đã thanh toán
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-zinc-400 uppercase tracking-widest">
                <th className="py-4 font-bold">Khóa học</th>
                <th className="py-4 text-right font-bold">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-6">
                    <p className="font-bold text-lg">{item.course.title}</p>
                    <p className="text-sm text-zinc-500">Truy cập trọn đời • Hỗ trợ 24/7</p>
                  </td>
                  <td className="py-6 text-right font-bold text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-full md:w-80 space-y-4">
            <div className="flex justify-between text-zinc-500">
              <span>Tạm tính</span>
              <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá ({order.coupon?.code})</span>
                <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.discount)}</span>
              </div>
            )}
            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex justify-between text-2xl font-black text-blue-600">
              <span>Tổng thanh toán</span>
              <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center border-t pt-8">
          <p className="text-zinc-400 text-sm italic">
            Cảm ơn bạn đã đồng hành cùng Vibecode Academy. <br />
            Hóa đơn này được tạo tự động và không cần chữ ký.
          </p>
        </div>
      </div>
    </div>
  )
}
