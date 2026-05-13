"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Banknote, CheckCircle, Clock, XCircle } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"

interface PayoutClientProps {
  totalRevenue: number
  availableBalance: number
  totalPaidOut: number
  payouts: any[]
}

export const PayoutClient = ({
  totalRevenue,
  availableBalance,
  totalPaidOut,
  payouts
}: PayoutClientProps) => {
  const [isRequesting, setIsRequesting] = useState(false)
  const [bankInfo, setBankInfo] = useState("")
  const [amount, setAmount] = useState(availableBalance)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onRequestPayout = async () => {
    if (amount < 100000) {
      toast.error("Số tiền tối thiểu để rút là 100.000đ")
      return
    }
    if (!bankInfo.trim()) {
      toast.error("Vui lòng nhập thông tin ngân hàng")
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch("/api/instructor/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, bankInfo })
      })

      if (!res.ok) throw new Error("Lỗi mạng")

      toast.success("Đã gửi yêu cầu rút tiền")
      setIsRequesting(false)
      router.refresh()
    } catch {
      toast.error("Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border shadow-sm">
          <p className="text-zinc-500 font-medium mb-1">Số dư khả dụng</p>
          <p className="text-3xl font-black text-blue-600">{formatPrice(availableBalance)}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border shadow-sm">
          <p className="text-zinc-500 font-medium mb-1">Tổng doanh thu</p>
          <p className="text-3xl font-black">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border shadow-sm">
          <p className="text-zinc-500 font-medium mb-1">Đã rút</p>
          <p className="text-3xl font-black text-emerald-600">{formatPrice(totalPaidOut)}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Lịch sử rút tiền</h2>
          <Button 
            onClick={() => setIsRequesting(!isRequesting)} 
            className="rounded-xl bg-blue-600 hover:bg-blue-700"
            disabled={availableBalance < 100000}
          >
            Yêu cầu rút tiền
          </Button>
        </div>

        {isRequesting && (
          <div className="mb-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-blue-200 dark:border-blue-900/30 space-y-4">
            <h3 className="font-bold">Thông tin rút tiền</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Số tiền muốn rút (Tối đa: {formatPrice(availableBalance)})</label>
              <input 
                type="number"
                className="w-full bg-white dark:bg-zinc-950 border rounded-xl px-4 py-2"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                max={availableBalance}
                min={100000}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Thông tin ngân hàng (Ngân hàng, Tên TK, Số TK)</label>
              <textarea 
                className="w-full bg-white dark:bg-zinc-950 border rounded-xl px-4 py-2"
                placeholder="VD: Vietcombank - NGUYEN VAN A - 0123456789"
                value={bankInfo}
                onChange={(e) => setBankInfo(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={onRequestPayout} disabled={isLoading} className="rounded-xl bg-blue-600">
                Xác nhận
              </Button>
              <Button onClick={() => setIsRequesting(false)} variant="ghost" className="rounded-xl">
                Hủy
              </Button>
            </div>
          </div>
        )}

        {payouts.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 border-2 border-dashed rounded-xl">
            <Banknote className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Chưa có lịch sử rút tiền nào.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payouts.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 border rounded-xl bg-zinc-50 dark:bg-zinc-900">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${p.status === "COMPLETED" ? "bg-emerald-100 text-emerald-600" : 
                      p.status === "FAILED" ? "bg-red-100 text-red-600" : 
                      "bg-amber-100 text-amber-600"}
                  `}>
                    {p.status === "COMPLETED" && <CheckCircle className="w-5 h-5" />}
                    {p.status === "FAILED" && <XCircle className="w-5 h-5" />}
                    {p.status === "PENDING" && <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold">{formatPrice(p.amount)}</h4>
                    <p className="text-xs text-zinc-500">{new Date(p.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {p.status === "PENDING" ? "Đang chờ xử lý" : p.status === "COMPLETED" ? "Thành công" : "Bị từ chối"}
                  </p>
                  <p className="text-xs text-zinc-500 max-w-[200px] truncate">{p.bankInfo}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
