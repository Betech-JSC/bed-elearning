import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface PaymentHistoryProps {
  orders: any[]
}

export function PaymentHistory({ orders }: PaymentHistoryProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 border rounded-xl bg-zinc-50 dark:bg-zinc-900/20">
        <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
        <p className="text-zinc-500">Bạn chưa có giao dịch nào.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
            <TableHead className="font-bold">Mã đơn hàng</TableHead>
            <TableHead className="font-bold">Ngày mua</TableHead>
            <TableHead className="font-bold">Phương thức</TableHead>
            <TableHead className="font-bold">Tổng tiền</TableHead>
            <TableHead className="font-bold">Trạng thái</TableHead>
            <TableHead className="text-right font-bold">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs uppercase">
                #{order.orderNumber.slice(-8)}
              </TableCell>
              <TableCell>
                {format(new Date(order.createdAt), "dd/MM/yyyy", { locale: vi })}
              </TableCell>
              <TableCell className="font-medium text-xs">
                {order.paymentMethod || "N/A"}
              </TableCell>
              <TableCell className="font-bold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "font-bold",
                    order.status === "PAID" && "bg-green-50 text-green-700 border-green-200",
                    order.status === "PENDING" && "bg-yellow-50 text-yellow-700 border-yellow-200",
                    order.status === "CANCELLED" && "bg-red-50 text-red-700 border-red-200"
                  )}
                >
                  {order.status === "PAID" ? "Đã thanh toán" : order.status === "PENDING" ? "Chờ xử lý" : "Đã hủy"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/profile/orders/${order.id}/invoice`}>
                  <Button variant="ghost" size="sm" className="gap-2 h-8">
                    <Eye className="w-4 h-4" />
                    Xem hóa đơn
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
