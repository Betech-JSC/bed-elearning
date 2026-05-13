"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle } from "lucide-react"
import { updateCourseStatus } from "@/lib/actions/admin"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ReviewActionsProps {
  courseId: string
}

export const ReviewActions = ({ courseId }: ReviewActionsProps) => {
  const router = useRouter()
  const [isRejecting, setIsRejecting] = useState(false)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const onApprove = async () => {
    try {
      setLoading(true)
      await updateCourseStatus(courseId, "PUBLISHED")
      toast.success("Khóa học đã được phê duyệt và công khai!")
      router.refresh()
    } catch {
      toast.error("Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  const onReject = async () => {
    if (!reason.trim()) {
      return toast.error("Vui lòng nhập lý do từ chối")
    }

    try {
      setLoading(true)
      await updateCourseStatus(courseId, "REJECTED", reason)
      toast.success("Khóa học đã bị từ chối")
      setIsRejecting(false)
      router.refresh()
    } catch {
      toast.error("Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Dialog open={isRejecting} onOpenChange={setIsRejecting}>
        <DialogTrigger
          render={
            <Button variant="outline" className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 gap-2 font-bold">
              <XCircle className="w-4 h-4" />
              Từ chối
            </Button>
          }
        />
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Lý do từ chối khóa học</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
             <p className="text-sm text-zinc-500">Giảng viên sẽ nhận được email thông báo kèm theo lý do này để họ có thể sửa đổi khóa học.</p>
             <Textarea 
                placeholder="Ví dụ: Nội dung video không đạt chất lượng, tiêu đề không rõ ràng..." 
                className="min-h-[120px] rounded-xl"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
             />
          </div>
          <DialogFooter className="gap-2 pt-4">
             <Button variant="ghost" onClick={() => setIsRejecting(false)} className="rounded-xl">Hủy</Button>
             <Button variant="destructive" onClick={onReject} disabled={loading} className="rounded-xl font-bold">Gửi từ chối</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button onClick={onApprove} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold px-8">
        <CheckCircle className="w-4 h-4" />
        Phê duyệt khóa học
      </Button>
    </div>
  )
}
