import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PrintButton } from "@/components/ui-custom/print-button"

export default async function InvoicePage({
  params
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const session = await auth()
  if (!session?.user?.id) return redirect("/login")

  const order = await prisma.order.findUnique({
    where: { id: orderId },
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Action Bar (Hide when printing) */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Link href="/profile" className={cn(buttonVariants({ variant: "ghost" }), "gap-2 rounded-2xl h-11 px-5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors")}>
          <ArrowLeft className="w-4 h-4" />
          Quay lại hồ sơ
        </Link>
        <PrintButton />
      </div>

      {/* Invoice Content */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-xl print:shadow-none print:border-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b dark:border-zinc-800 pb-8">
          <div>
            <h1 className="text-3xl font-black text-[#FF6600] mb-2 tracking-tight">BELEARNING</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Nền tảng học tập trực tuyến hàng đầu</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase tracking-widest">Hóa đơn điện tử</h2>
            <p className="font-mono text-zinc-500 uppercase mt-1 text-sm">#{order.orderNumber.slice(-12)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-black mb-3">Thông tin khách hàng</h3>
            <div className="space-y-1">
              <p className="font-black text-lg text-zinc-800 dark:text-zinc-100">{order.user.name}</p>
              <p className="text-zinc-500 text-sm">{order.user.email}</p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-black mb-3">Thông tin thanh toán</h3>
            <div className="space-y-1">
              <p className="font-medium text-sm text-zinc-700 dark:text-zinc-300">Ngày: {format(new Date(order.createdAt), "dd MMMM, yyyy", { locale: vi })}</p>
              <p className="font-medium text-sm text-zinc-700 dark:text-zinc-300 uppercase">Phương thức: {order.paymentMethod}</p>
              <p className="flex items-center md:justify-end gap-1.5 text-emerald-600 font-bold text-sm mt-1">
                <CheckCircle2 className="w-4 h-4" />
                Đã thanh toán thành công
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-zinc-800 text-xs text-zinc-400 uppercase tracking-widest">
                <th className="py-4 font-black">Khóa học</th>
                <th className="py-4 text-right font-black">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-800">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-6">
                    <p className="font-black text-base text-zinc-800 dark:text-zinc-100">{item.course.title}</p>
                    <p className="text-xs text-zinc-400 mt-1">Truy cập trọn đời • Hỗ trợ học tập 24/7</p>
                  </td>
                  <td className="py-6 text-right font-bold text-base text-zinc-800 dark:text-zinc-100">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-full md:w-80 space-y-4">
            <div className="flex justify-between text-zinc-500 text-sm font-medium">
              <span>Tạm tính</span>
              <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 text-sm font-medium">
                <span>Giảm giá ({order.coupon?.code})</span>
                <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.discount)}</span>
              </div>
            )}
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex justify-between text-2xl font-black text-[#FF6600]">
              <span>Tổng thanh toán</span>
              <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center border-t dark:border-zinc-800 pt-8">
          <p className="text-zinc-400 text-xs italic leading-relaxed">
            Cảm ơn bạn đã đồng hành cùng Belearning. <br />
            Hóa đơn này được tạo tự động từ hệ thống và không cần chữ ký.
          </p>
        </div>
      </div>
    </div>
  )
}
