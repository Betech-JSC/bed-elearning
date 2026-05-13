"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface PublishButtonProps {
  courseId: string
  status: string
}

export function PublishButton({ courseId, status }: PublishButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const isPublished = status === "PUBLISHED"
  const isPending = status === "PENDING_REVIEW"

  const onClick = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/instructor/courses/${courseId}/publish`, {
        method: "POST"
      })

      // BUG-11 FIX: Parse JSON error message properly
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Gửi duyệt thất bại" }))
        throw new Error(error.message || "Gửi duyệt thất bại")
      }

      toast.success("Khóa học đã được gửi đi phê duyệt!")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isPublished) {
    return (
      <Button disabled className="bg-green-600 text-white gap-2 font-bold px-6">
        <CheckCircle className="w-4 h-4" />
        Đã công bố
      </Button>
    )
  }

  return (
    <Button 
      onClick={onClick}
      disabled={isLoading || isPending} 
      className="bg-blue-600 hover:bg-blue-700 gap-2 font-bold px-6"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <Send className="w-4 h-4" />
          {isPending ? "Chờ duyệt..." : "Gửi duyệt"}
        </>
      )}
    </Button>
  )
}
