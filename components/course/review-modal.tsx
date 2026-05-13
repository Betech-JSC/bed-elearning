"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import axios from "axios"

interface ReviewModalProps {
  courseId: string
  isOpen: boolean
  onClose: () => void
}

export const ReviewModal = ({
  courseId,
  isOpen,
  onClose
}: ReviewModalProps) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {
    if (rating === 0) {
      return toast.error("Vui lòng chọn số sao đánh giá")
    }
    if (!comment) {
      return toast.error("Vui lòng nhập nhận xét của bạn")
    }

    try {
      setIsLoading(true)
      await axios.post(`/api/courses/${courseId}/reviews`, {
        rating,
        comment
      })
      toast.success("Cảm ơn bạn đã đánh giá khóa học!")
      onClose()
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi đánh giá")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center">Đánh giá khóa học</DialogTitle>
          <p className="text-center text-zinc-500 text-sm">
            Chúc mừng bạn đã hoàn thành khóa học! Hãy chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện nhé.
          </p>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                className="transition-transform active:scale-90"
              >
                <Star 
                  className={cn(
                    "w-10 h-10 transition-colors",
                    s <= rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-200"
                  )}
                />
              </button>
            ))}
          </div>

          <Textarea 
            placeholder="Bạn nghĩ gì về nội dung khóa học và giảng viên?"
            className="rounded-2xl min-h-[120px] bg-zinc-50 border-none focus:ring-2 focus:ring-blue-500"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black text-white shadow-xl shadow-blue-600/20"
          >
            {isLoading ? "Đang gửi..." : "Gửi đánh giá ngay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
