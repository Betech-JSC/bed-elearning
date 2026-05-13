"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin area error:", error)
  }, [error])

  const isDbError =
    error.message?.includes("Can't reach database") ||
    error.message?.includes("P1001") ||
    error.message?.includes("Connection refused") ||
    error.message?.includes("neon.tech")

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
      </div>

      {isDbError ? (
        <>
          <h2 className="text-2xl font-black mb-2">Database đang khởi động...</h2>
          <p className="text-zinc-500 max-w-md mb-2">
            Neon Serverless Database cần vài giây để thức dậy sau thời gian nghỉ.
          </p>
          <p className="text-sm text-zinc-400 mb-8">
            Nhấn <strong>Thử lại</strong> — thường chỉ cần 1 lần là xong.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-black mb-2">Có lỗi xảy ra</h2>
          <p className="text-zinc-500 max-w-md mb-1 text-sm font-mono bg-zinc-100 dark:bg-zinc-900 px-3 py-2 rounded-lg">
            {error.message?.slice(0, 120) || "Unknown error"}
          </p>
          <p className="text-zinc-400 text-sm mb-8">Vui lòng thử lại hoặc liên hệ dev team.</p>
        </>
      )}

      <div className="flex gap-3">
        <Button onClick={reset} className="gap-2 rounded-xl px-6 font-bold">
          <RefreshCw className="w-4 h-4" />
          Thử lại
        </Button>
        <Button asChild variant="outline" className="gap-2 rounded-xl px-6 font-bold">
          <Link href="/admin/dashboard">
            <Home className="w-4 h-4" />
            Về Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
