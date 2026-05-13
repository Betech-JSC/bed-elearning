"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { 
  Copy, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  QrCode,
  Smartphone,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axios from "axios"

interface SePayClientProps {
  orderId: string
  qrUrl: string
  amount: number
  message: string
  bankName: string
  accountNo: string
  accountName: string
}

export function SePayClient({
  orderId,
  qrUrl,
  amount,
  message,
  bankName,
  accountNo,
  accountName
}: SePayClientProps) {
  const router = useRouter()
  const [isCopied, setIsCopied] = useState(false)
  const [status, setStatus] = useState<"PENDING" | "PAID">("PENDING")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    toast.success("Đã sao chép!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Poll for order status
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}/status`)
        if (response.data.status === "PAID" || response.data.status === "COMPLETED") {
          setStatus("PAID")
          clearInterval(interval)
          toast.success("Thanh toán thành công!")
          setTimeout(() => {
            router.push(`/checkout/success?orderId=${orderId}`)
          }, 2000)
        }
      } catch (error) {
        console.error("Error checking order status:", error)
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [orderId, router])

  return (
    <div className="space-y-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="rounded-xl gap-2 text-zinc-500"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </Button>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Thanh toán chuyển khoản QR</h1>
        <p className="text-zinc-500">Mở ứng dụng Ngân hàng để quét mã QR bên dưới</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* QR CODE BOX */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-blue-600/20 rounded-[2.5rem] p-8 flex flex-col items-center justify-center space-y-6 shadow-2xl shadow-blue-600/5">
           <div className="relative w-full aspect-square max-w-[300px] rounded-3xl overflow-hidden border-4 border-white shadow-xl">
              <Image 
                src={qrUrl} 
                alt="VietQR" 
                fill 
                className="object-contain"
                priority
              />
           </div>
           <div className="flex items-center gap-2 text-blue-600 font-bold text-sm bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang chờ bạn thanh toán...
           </div>
        </div>

        {/* DETAILS BOX */}
        <div className="space-y-6">
           <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-sm text-zinc-500">Số tiền cần thanh toán</span>
                 <span className="text-xl font-black text-blue-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
                 </span>
              </div>
              <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-4">
                 <DetailItem label="Ngân hàng" value={bankName} />
                 <DetailItem label="Số tài khoản" value={accountNo} copyable onCopy={() => copyToClipboard(accountNo)} />
                 <DetailItem label="Chủ tài khoản" value={accountName} />
                 <DetailItem label="Nội dung chuyển khoản" value={message} copyable onCopy={() => copyToClipboard(message)} highlight />
              </div>
           </div>

           <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-400 space-y-1">
                 <p className="font-bold">Lưu ý quan trọng:</p>
                 <p>Bạn phải nhập chính xác <strong>Nội dung chuyển khoản</strong> để hệ thống tự động kích hoạt khóa học trong 1-3 phút.</p>
              </div>
           </div>

           <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                 <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                 </div>
                 <p>Sau khi chuyển khoản thành công, trang web sẽ tự động chuyển hướng. Vui lòng không đóng trình duyệt.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ 
  label, 
  value, 
  copyable, 
  onCopy,
  highlight
}: { 
  label: string; 
  value: string; 
  copyable?: boolean; 
  onCopy?: () => void;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-xs text-zinc-400 font-medium shrink-0">{label}</span>
      <div className="flex items-center gap-2 overflow-hidden">
        <span className={cn(
          "font-bold truncate text-sm",
          highlight ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded" : ""
        )}>
          {value}
        </span>
        {copyable && (
          <button 
            onClick={onCopy}
            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors shrink-0"
          >
            <Copy className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        )}
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
