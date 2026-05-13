"use client"

import { useSearchParams } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { XCircle, RefreshCcw, HelpCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function FailedPage() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const message = searchParams.get("message")

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-8">
        <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
      </div>
      
      <h1 className="text-4xl font-extrabold mb-4">Thanh toán thất bại</h1>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-10">
        Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý thanh toán của bạn. 
        {code && <span className="block mt-2 font-mono text-sm">Mã lỗi: {code}</span>}
        {message && <span className="block mt-1 text-sm italic">{message}</span>}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/checkout" 
          className={cn(buttonVariants(), "h-14 px-8 text-lg font-bold bg-zinc-900 hover:bg-zinc-800")}
        >
          <RefreshCcw className="mr-2 w-5 h-5" />
          Thử lại
        </Link>
        <Link 
          href="/contact" 
          className={cn(buttonVariants({ variant: "outline" }), "h-14 px-8 text-lg font-bold")}
        >
          <HelpCircle className="mr-2 w-5 h-5" />
          Liên hệ hỗ trợ
        </Link>
      </div>
    </div>
  )
}
