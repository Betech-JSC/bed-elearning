"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CompleteButtonProps {
  courseId: string
  lessonId: string
  isCompleted: boolean
  nextLessonId?: string
  courseSlug: string
}

export function CompleteButton({
  courseId,
  lessonId,
  isCompleted: initialIsCompleted,
  nextLessonId,
  courseSlug
}: CompleteButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted)

  const onClick = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/progress`, {
        method: "POST",
        body: JSON.stringify({ isCompleted: !isCompleted })
      })

      if (!response.ok) throw new Error("Failed to update progress")

      const data = await response.json()
      setIsCompleted(!isCompleted)
      
      toast.success(!isCompleted ? "Đã hoàn thành bài học!" : "Đã bỏ hoàn thành bài học")
      router.refresh()

      if (!isCompleted && nextLessonId) {
        toast("Sẽ chuyển sang bài tiếp theo sau 3 giây...", {
          action: {
            label: "Hủy",
            onClick: () => {
              // We just don't redirect, the timer won't start if we check a ref, 
              // but for simplicity in MVP we just use a timeout we can clear.
            }
          },
          duration: 3000,
          onAutoClose: () => {
            router.push(`/learn/${courseSlug}/${nextLessonId}`)
          }
        })
      }

    } catch (error) {
      toast.error("Đã có lỗi xảy ra.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "gap-2 bg-blue-600 hover:bg-blue-700 transition-all",
        isCompleted && "bg-green-600 hover:bg-green-700"
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isCompleted ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          Đã hoàn thành
        </>
      ) : (
        "Đánh dấu hoàn thành"
      )}
    </Button>
  )
}
