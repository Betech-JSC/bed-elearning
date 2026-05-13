"use client"

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { toggleCouponActive } from "@/lib/actions/admin"
import { toast } from "sonner"

interface CouponListProps {
  coupons: any[]
}

export const CouponList = ({ coupons }: CouponListProps) => {
  const onToggle = async (id: string, current: boolean) => {
    try {
      await toggleCouponActive(id, !current)
      toast.success("Cập nhật thành công")
    } catch {
      toast.error("Có lỗi xảy ra")
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50/50 dark:bg-zinc-800/50">
            <TableHead>Mã code</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Giá trị</TableHead>
            <TableHead>Đã dùng / Tối đa</TableHead>
            <TableHead>Ngày hết hạn</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Kích hoạt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-zinc-500 italic">
                Chưa có mã giảm giá nào.
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                <TableCell className="font-mono font-bold text-blue-600">
                  {coupon.code}
                </TableCell>
                <TableCell className="text-sm">
                  {coupon.type === "PERCENTAGE" ? "Phần trăm" : "Cố định"}
                </TableCell>
                <TableCell className="font-bold">
                  {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.value)}
                </TableCell>
                <TableCell className="text-sm">
                  {coupon._count.usages} / {coupon.maxUses}
                </TableCell>
                <TableCell className="text-sm text-zinc-500">
                  {coupon.expiresAt ? format(new Date(coupon.expiresAt), "dd/MM/yyyy") : "Không thời hạn"}
                </TableCell>
                <TableCell>
                   <Badge 
                      variant="outline"
                      className={coupon.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-zinc-50 text-zinc-500 border-zinc-200"}
                   >
                      {coupon.isActive ? "Đang chạy" : "Tạm dừng"}
                   </Badge>
                </TableCell>
                <TableCell className="text-right">
                   <Switch 
                      checked={coupon.isActive} 
                      onCheckedChange={() => onToggle(coupon.id, coupon.isActive)}
                   />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
