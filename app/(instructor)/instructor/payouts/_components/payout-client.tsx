"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Banknote, CheckCircle, Clock, XCircle, ArrowUpRight, Wallet, History, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface PayoutClientProps {
  totalRevenue: number
  availableBalance: number
  totalPaidOut: number
  payouts: any[]
  lastBankInfo?: string
}

export const PayoutClient = ({
  totalRevenue,
  availableBalance,
  totalPaidOut,
  payouts,
  lastBankInfo = ""
}: PayoutClientProps) => {
  const [isRequesting, setIsRequesting] = useState(false)
  const [bankInfo, setBankInfo] = useState(lastBankInfo)
  const [amount, setAmount] = useState<number | "">("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onRequestPayout = async () => {
    const requestAmount = Number(amount)
    if (!requestAmount || requestAmount < 100000) {
      toast.error("Số tiền tối thiểu để rút là 100.000đ")
      return
    }
    if (requestAmount > availableBalance) {
      toast.error("Số dư khả dụng không đủ")
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
        body: JSON.stringify({ amount: requestAmount, bankInfo })
      })

      if (!res.ok) throw new Error("Lỗi mạng")

      toast.success("Đã gửi yêu cầu rút tiền thành công")
      setIsRequesting(false)
      setAmount("")
      router.refresh()
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  const fillMaxAmount = () => {
    setAmount(availableBalance)
  }

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-[2rem] bg-blue-600 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-125" />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-3 text-blue-100 mb-4">
              <Wallet className="w-5 h-5" />
              <p className="font-bold text-xs uppercase tracking-widest">Số dư khả dụng</p>
            </div>
            <p className="text-4xl font-black text-white mb-2">{formatPrice(availableBalance)}</p>
            <p className="text-xs text-blue-200 font-medium">Sẵn sàng rút về tài khoản ngân hàng</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2rem] bg-white dark:bg-zinc-900 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 text-zinc-500 mb-4">
              <ArrowUpRight className="w-5 h-5" />
              <p className="font-bold text-xs uppercase tracking-widest">Tổng doanh thu</p>
            </div>
            <p className="text-4xl font-black text-zinc-900 dark:text-zinc-50 mb-2">{formatPrice(totalRevenue)}</p>
            <p className="text-xs text-zinc-400 font-medium">Tổng thu nhập tích lũy trên hệ thống</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2rem] bg-white dark:bg-zinc-900 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 text-emerald-500 mb-4">
              <CheckCircle className="w-5 h-5" />
              <p className="font-bold text-xs uppercase tracking-widest">Đã rút thành công</p>
            </div>
            <p className="text-4xl font-black text-emerald-600 mb-2">{formatPrice(totalPaidOut)}</p>
            <p className="text-xs text-zinc-400 font-medium">Tổng số tiền đã chuyển khoản</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Area */}
      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden">
        <CardHeader className="p-8 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-8">
          <div>
            <CardTitle className="text-xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
              <History className="w-6 h-6 text-[#FF6600]" />
              Lịch sử rút tiền
            </CardTitle>
            <p className="text-sm text-zinc-500 font-medium mt-2">Theo dõi và quản lý các giao dịch chuyển khoản doanh thu của bạn.</p>
          </div>
          <Button 
            onClick={() => setIsRequesting(!isRequesting)} 
            disabled={availableBalance < 100000 && !isRequesting}
            className={`rounded-2xl h-12 px-8 font-black text-xs uppercase tracking-widest transition-all ${
              isRequesting ? 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300' : 'bg-[#FF6600] text-white hover:bg-orange-600 shadow-xl shadow-orange-500/20'
            }`}
          >
            {isRequesting ? "Hủy thao tác" : "Yêu cầu rút tiền"}
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Request Form Area */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden bg-[#F8F9FA] dark:bg-zinc-900/50 ${isRequesting ? 'max-h-[800px] border-b border-zinc-100 dark:border-zinc-800' : 'max-h-0'}`}>
            <div className="p-8 max-w-3xl">
              <div className="flex items-start gap-4 mb-8 p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-blue-900">Hướng dẫn làm lệnh rút tiền</h4>
                  <p className="text-xs text-blue-700/80 font-medium leading-relaxed">
                    Số tiền rút tối thiểu là 100.000đ. Hệ thống đã tự động lưu và gợi ý thông tin ngân hàng từ lần rút tiền trước của bạn (nếu có). Quản trị viên sẽ xử lý lệnh chuyển khoản và gửi thông báo cho bạn.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Số tiền muốn rút (VNĐ)</label>
                    <button onClick={fillMaxAmount} className="text-[10px] font-black text-[#FF6600] uppercase tracking-widest hover:underline">
                      Rút toàn bộ: {formatPrice(availableBalance)}
                    </button>
                  </div>
                  <Input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || "")}
                    placeholder="VD: 500000"
                    className="h-14 rounded-2xl border-zinc-200 bg-white px-6 text-sm font-bold focus-visible:ring-[#FF6600]/20"
                    max={availableBalance}
                    min={100000}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Thông tin ngân hàng thụ hưởng</label>
                  <Textarea 
                    value={bankInfo}
                    onChange={(e) => setBankInfo(e.target.value)}
                    placeholder="VD: Vietcombank - NGUYEN VAN A - 0123456789"
                    rows={3}
                    className="rounded-[1.5rem] border-zinc-200 bg-white p-6 text-sm font-bold focus-visible:ring-[#FF6600]/20 resize-none"
                  />
                </div>

                <Button 
                  onClick={onRequestPayout} 
                  disabled={isLoading || !amount || Number(amount) < 100000} 
                  className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20"
                >
                  {isLoading ? "Đang xử lý..." : "Xác nhận gửi yêu cầu"}
                </Button>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="p-8">
            {payouts.length === 0 ? (
              <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                <Banknote className="w-16 h-16 mx-auto mb-6 text-zinc-300" />
                <h3 className="font-bold text-zinc-500 mb-1">Chưa có giao dịch nào</h3>
                <p className="text-xs text-zinc-400 font-medium">Bạn chưa thực hiện lệnh rút tiền nào từ hệ thống.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payouts.map((p) => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] bg-zinc-50/50 hover:bg-white transition-colors group">
                    <div className="flex items-start sm:items-center gap-5 mb-4 sm:mb-0">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm
                        ${p.status === "PAID" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : 
                          p.status === "FAILED" ? "bg-red-50 border-red-100 text-red-600" : 
                          "bg-amber-50 border-amber-100 text-amber-600"}
                      `}>
                        {p.status === "PAID" && <CheckCircle className="w-6 h-6" />}
                        {p.status === "FAILED" && <XCircle className="w-6 h-6" />}
                        {p.status === "PENDING" && <Clock className="w-6 h-6 animate-pulse" />}
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-zinc-900 dark:text-zinc-100">{formatPrice(p.amount)}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-zinc-400">
                            {new Date(p.createdAt).toLocaleDateString("vi-VN", {
                              day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                            })}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                          <span className={`text-[10px] font-black uppercase tracking-widest
                            ${p.status === "PAID" ? "text-emerald-600" : 
                              p.status === "FAILED" ? "text-red-600" : 
                              "text-amber-600"}
                          `}>
                            {p.status === "PENDING" ? "Đang chờ xử lý" : p.status === "PAID" ? "Thành công" : "Bị từ chối"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="sm:text-right pl-19 sm:pl-0 border-t border-zinc-200 pt-4 sm:border-none sm:pt-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Thông tin ngân hàng</p>
                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 max-w-[250px] truncate" title={p.bankInfo}>
                        {p.bankInfo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
