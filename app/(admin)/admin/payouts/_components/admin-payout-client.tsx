"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, XCircle, Search } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"

interface AdminPayoutClientProps {
  payouts: any[]
}

export const AdminPayoutClient = ({ payouts }: AdminPayoutClientProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState<string | null>(null)
  const [remarks, setRemarks] = useState("")
  const router = useRouter()

  const onUpdateStatus = async (id: string, status: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/admin/payouts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, remarks })
      })

      if (!res.ok) throw new Error("Lỗi mạng")

      toast.success("Đã cập nhật trạng thái")
      setSelectedPayout(null)
      setRemarks("")
      router.refresh()
    } catch {
      toast.error("Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-950 border rounded-2xl p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-zinc-500">
              <th className="pb-3 font-medium">Giảng viên</th>
              <th className="pb-3 font-medium">Số tiền</th>
              <th className="pb-3 font-medium">Thông tin ngân hàng</th>
              <th className="pb-3 font-medium">Ngày yêu cầu</th>
              <th className="pb-3 font-medium">Trạng thái</th>
              <th className="pb-3 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payouts.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="py-4 font-medium">{p.instructor.name}</td>
                <td className="py-4 font-bold text-blue-600">{formatPrice(p.amount)}</td>
                <td className="py-4 text-xs max-w-[200px] truncate" title={p.bankInfo}>{p.bankInfo}</td>
                <td className="py-4">{new Date(p.createdAt).toLocaleDateString("vi-VN")}</td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase
                    ${p.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : 
                      p.status === "FAILED" ? "bg-red-100 text-red-700" : 
                      "bg-amber-100 text-amber-700"}
                  `}>
                    {p.status}
                  </span>
                </td>
                <td className="py-4">
                  {p.status === "PENDING" && (
                    <div className="flex gap-2">
                      {selectedPayout === p.id ? (
                        <div className="flex gap-2 items-center">
                          <input 
                            placeholder="Lý do/Ghi chú..."
                            className="border rounded-md px-2 py-1 text-xs w-32"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                          />
                          <Button onClick={() => onUpdateStatus(p.id, "COMPLETED")} size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700">Duyệt</Button>
                          <Button onClick={() => onUpdateStatus(p.id, "FAILED")} size="sm" variant="destructive" className="h-7 text-xs">Từ chối</Button>
                          <Button onClick={() => setSelectedPayout(null)} size="sm" variant="ghost" className="h-7 text-xs">Hủy</Button>
                        </div>
                      ) : (
                        <Button onClick={() => setSelectedPayout(p.id)} size="sm" variant="outline" className="h-7 text-xs rounded-md">
                          Xử lý
                        </Button>
                      )}
                    </div>
                  )}
                  {p.status !== "PENDING" && <span className="text-xs text-zinc-500">{p.remarks || "Không có ghi chú"}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payouts.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            Chưa có yêu cầu rút tiền nào.
          </div>
        )}
      </div>
    </div>
  )
}
