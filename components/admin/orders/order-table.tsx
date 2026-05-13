"use client"

import { useState } from "react"
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, RotateCcw, Eye, Search } from "lucide-react"
import { format } from "date-fns"
import { refundOrder } from "@/lib/actions/admin"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface OrderTableProps {
  orders: any[]
}

export const OrderTable = ({ orders }: OrderTableProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const onRefund = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn đánh dấu đơn hàng này là đã hoàn tiền? Hành động này không thể hoàn tác.")) return

    try {
      await refundOrder(id)
      toast.success("Cập nhật trạng thái hoàn tiền thành công")
    } catch {
      toast.error("Có lỗi xảy ra")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Tìm theo mã đơn hoặc tên khách hàng..." 
            className="pl-10 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "ALL")}>
            <SelectTrigger className="w-full md:w-[200px] rounded-xl">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
              <SelectItem value="PAID">Đã thanh toán</SelectItem>
              <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              <SelectItem value="FAILED">Thất bại</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50 dark:bg-zinc-800/50">
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Phương thức</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-zinc-500 italic">
                  Không tìm thấy đơn hàng nào.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <TableCell className="font-bold text-sm">
                    #{order.orderNumber.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{order.user.name}</span>
                      <span className="text-[10px] text-zinc-500">{order.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                       {order.items.map((item: any) => (
                          <span key={item.id} className="text-[11px] line-clamp-1 text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded">
                             {item.course.title}
                          </span>
                       ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-sm">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold">
                       {order.paymentMethod || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={cn(
                        "font-bold uppercase text-[10px]",
                        order.status === "PAID" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        order.status === "PENDING" ? "bg-blue-50 text-blue-600 border-blue-200" :
                        order.status === "REFUNDED" ? "bg-purple-50 text-purple-600 border-purple-200" :
                        "bg-zinc-50 text-zinc-600 border-zinc-200"
                      )}
                      variant="outline"
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-500 text-xs">
                    {format(new Date(order.createdAt), "dd/MM HH:mm")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>} />
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                        <DropdownMenuItem className="rounded-lg cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        {order.status === "PAID" && (
                          <DropdownMenuItem 
                            className="rounded-lg text-purple-600 focus:text-purple-600 focus:bg-purple-50 cursor-pointer"
                            onClick={() => onRefund(order.id)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Hoàn tiền (Manual)
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
