"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin dashboard error:", error)
  }, [error])

  const isDbError =
    error.message?.includes("Can't reach database") ||
    error.message?.includes("P1001") ||
    error.message?.includes("Connection refused")

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
      </div>

      {isDbError ? (
        <>
          <h2 className="text-2xl font-black mb-2">Database đang khởi động</h2>
          <p className="text-zinc-500 max-w-md mb-2">
            Neon Serverless Database đang thức dậy sau thời gian nghỉ. Quá trình này mất khoảng
            <span className="font-bold text-zinc-700"> 2-5 giây</span>.
          </p>
          <p className="text-sm text-zinc-400 mb-8">
            Nhấn <strong>Thử lại</strong> để tải lại dashboard.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-black mb-2">Đã xảy ra lỗi</h2>
          <p className="text-zinc-500 max-w-md mb-8">
            {error.message || "Có lỗi không xác định xảy ra. Vui lòng thử lại."}
          </p>
        </>
      )}

      <Button
        onClick={reset}
        className="gap-2 rounded-xl px-8 font-bold"
      >
        <RefreshCw className="w-4 h-4" />
        Thử lại
      </Button>
    </div>
  )
}
