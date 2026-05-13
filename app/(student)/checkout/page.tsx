"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Trash2, 
  Tag, 
  CreditCard, 
  Wallet, 
  ShieldCheck, 
  ArrowRight,
  Loader2,
  ShoppingCart
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import axios from "axios"

export default function CheckoutPage() {
  const { items, removeItem, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "VNPAY" | "SEPAY">("VNPAY")
  const [isLoading, setIsLoading] = useState(false)

  const subtotal = items.reduce((acc, item) => acc + item.price, 0)
  const total = Math.max(0, subtotal - discount)

  const onCheckout = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post("/api/checkout", {
        items: items.map(i => i.id),
        couponCode,
        paymentMethod
      })

      window.location.href = response.data.url
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi")
    } finally {
      setIsLoading(false)
    }
  }

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "VIBECODE10") {
      setDiscount(subtotal * 0.1)
      toast.success("Áp dụng mã giảm giá thành công!")
    } else {
      toast.error("Mã giảm giá không hợp lệ")
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-6">
         <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingCart className="w-12 h-12 text-zinc-300" />
         </div>
         <h1 className="text-4xl font-black">Giỏ hàng đang trống</h1>
         <p className="text-zinc-500 max-w-md mx-auto">Hãy khám phá các khóa học hấp dẫn của chúng tôi để bắt đầu hành trình chinh phục AI nhé!</p>
         <Button asChild className="rounded-2xl h-14 px-8 font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20">
            <Link href="/courses">Khám phá ngay</Link>
         </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-black mb-12 tracking-tight">Thanh toán</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* LEFT: ORDER ITEMS */}
        <div className="lg:col-span-2 space-y-8">
           <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                 <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-sm">1</div>
                 Đơn hàng của bạn
              </h2>
              <div className="bg-white dark:bg-zinc-950 border rounded-3xl overflow-hidden divide-y">
                 {items.map((item) => (
                    <div key={item.id} className="p-6 flex gap-6 items-center group">
                       <div className="relative aspect-video w-32 rounded-xl overflow-hidden border shrink-0">
                          <Image src={item.thumbnail || ""} alt={item.title} fill className="object-cover" />
                       </div>
                       <div className="flex-1 space-y-1">
                          <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{item.title}</h3>
                          <p className="text-sm text-zinc-500 italic">Giảng viên: {item.instructorName}</p>
                       </div>
                       <div className="text-right space-y-2">
                          <div className="font-black text-xl text-blue-600">
                             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-600 text-xs font-bold flex items-center gap-1 ml-auto"
                          >
                             <Trash2 className="w-3.5 h-3.5" />
                             Xóa
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                 <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-sm">2</div>
                 Mã giảm giá
              </h2>
              <div className="flex gap-4">
                 <div className="relative flex-1">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                       placeholder="Nhập mã ưu đãi (ví dụ: VIBECODE10)..." 
                       className="h-14 pl-12 rounded-2xl bg-white dark:bg-zinc-950 border-zinc-200 focus:ring-blue-500"
                       value={couponCode}
                       onChange={(e) => setCouponCode(e.target.value)}
                    />
                 </div>
                 <Button 
                   onClick={applyCoupon}
                   variant="secondary" 
                   className="h-14 px-8 rounded-2xl font-bold"
                 >
                    Áp dụng
                 </Button>
              </div>
           </div>
        </div>

        {/* RIGHT: SUMMARY & PAYMENT */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white dark:bg-zinc-950 border rounded-3xl p-8 shadow-2xl shadow-zinc-200/50 dark:shadow-none space-y-8">
              <h2 className="text-xl font-bold">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-4 text-sm">
                 <div className="flex justify-between text-zinc-500 font-medium">
                    <span>Tạm tính</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                 </div>
                 <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Giảm giá</span>
                    <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount)}</span>
                 </div>
                 <div className="pt-4 border-t flex justify-between items-end">
                    <span className="font-bold text-zinc-900 dark:text-white">Tổng cộng</span>
                    <span className="text-3xl font-black text-blue-600">
                       {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                    </span>
                 </div>
              </div>

              <div className="space-y-4">
                 <p className="font-bold text-sm">Phương thức thanh toán:</p>
                 <div className="space-y-3">
                    <button 
                       onClick={() => setPaymentMethod("VNPAY")}
                       className={cn(
                          "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all",
                          paymentMethod === "VNPAY" ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/10" : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200"
                       )}
                    >
                       <div className="flex items-center gap-3">
                          <Wallet className={cn("w-5 h-5", paymentMethod === "VNPAY" ? "text-blue-600" : "text-zinc-400")} />
                          <span className="font-bold">Ví điện tử / ATM (VNPay)</span>
                       </div>
                       {paymentMethod === "VNPAY" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </button>
                    <button 
                       onClick={() => setPaymentMethod("STRIPE")}
                       className={cn(
                          "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all",
                          paymentMethod === "STRIPE" ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/10" : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200"
                       )}
                    >
                       <div className="flex items-center gap-3">
                          <CreditCard className={cn("w-5 h-5", paymentMethod === "STRIPE" ? "text-blue-600" : "text-zinc-400")} />
                          <span className="font-bold">Thẻ Quốc tế (Stripe)</span>
                       </div>
                       {paymentMethod === "STRIPE" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </button>
                    <button 
                       onClick={() => setPaymentMethod("SEPAY")}
                       className={cn(
                          "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all",
                          paymentMethod === "SEPAY" ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/10" : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200"
                       )}
                    >
                       <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center text-[10px] text-white font-bold">QR</div>
                          <span className="font-bold">Chuyển khoản QR (SePay)</span>
                       </div>
                       {paymentMethod === "SEPAY" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </button>
                 </div>
              </div>

              <Button 
                onClick={onCheckout}
                disabled={isLoading}
                className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black text-xl shadow-xl shadow-blue-600/20 gap-2 transition-all active:scale-95"
              >
                 {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                 ) : (
                    <>
                       Thanh toán ngay
                       <ArrowRight className="w-6 h-6" />
                    </>
                 )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 font-medium">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" />
                 Thanh toán an toàn & bảo mật 100%
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
