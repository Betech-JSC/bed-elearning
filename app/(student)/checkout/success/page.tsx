"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useCart } from "@/lib/store/use-cart"
import { Button, buttonVariants } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear cart on success
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-8 animate-bounce">
        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
      </div>
      
      <h1 className="text-4xl font-extrabold mb-4">Thanh toán thành công!</h1>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-10">
        Cảm ơn bạn đã tin tưởng Vibecode Academy. Đơn hàng <span className="font-bold text-zinc-900 dark:text-white">#{orderId?.slice(-6)}</span> của bạn đã được xử lý thành công.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/my-courses" 
          className={cn(buttonVariants(), "h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20")}
        >
          <BookOpen className="mr-2 w-5 h-5" />
          Vào học ngay
        </Link>
        <Link 
          href="/" 
          className={cn(buttonVariants({ variant: "outline" }), "h-14 px-8 text-lg font-bold")}
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Đang tải...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
