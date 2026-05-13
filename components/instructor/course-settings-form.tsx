"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AlertTriangle, Trash2, EyeOff, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

interface CourseSettingsFormProps {
  course: any
}

export function CourseSettingsForm({ course }: CourseSettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isHidden, setIsHidden] = useState(course.isHidden)

  const onToggleVisibility = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/instructor/courses/${course.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isHidden: !isHidden })
      })
      if (!res.ok) throw new Error()
      
      setIsHidden(!isHidden)
      toast.success(isHidden ? "Khóa học đã hiển thị" : "Khóa học đã được ẩn")
    } catch (error) {
      toast.error("Lỗi khi cập nhật hiển thị")
    } finally {
      setIsLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)
      const confirmDelete = confirm("Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể hoàn tác.")
      if (!confirmDelete) return

      const res = await fetch(`/api/instructor/courses/${course.id}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error()

      toast.success("Khóa học đã được xóa")
      router.push("/instructor/dashboard")
    } catch (error) {
      toast.error("Lỗi khi xóa khóa học")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-white dark:bg-zinc-900 border-b">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            Chế độ hiển thị
          </CardTitle>
          <CardDescription>Kiểm soát việc học viên có thể tìm thấy khóa học này hay không.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-zinc-900">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <p className="font-bold">{isHidden ? "Đang ẩn" : "Đang công khai"}</p>
                 <p className="text-xs text-zinc-500">
                   {isHidden 
                     ? "Khóa học sẽ không xuất hiện trên trang chủ và kết quả tìm kiếm." 
                     : "Tất cả mọi người đều có thể tìm thấy khóa học này."}
                 </p>
              </div>
              <Switch 
                checked={!isHidden} 
                onCheckedChange={onToggleVisibility}
                disabled={isLoading}
              />
           </div>
        </CardContent>
      </Card>

      <Card className="border-red-100 dark:border-red-900/30 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-red-50/50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/30">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Vùng nguy hiểm
          </CardTitle>
          <CardDescription className="text-red-600/70 dark:text-red-400/70">Các hành động này sẽ ảnh hưởng vĩnh viễn đến dữ liệu của bạn.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-zinc-900">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <p className="font-bold">Xóa khóa học</p>
                 <p className="text-xs text-zinc-500">Toàn bộ nội dung, video và dữ liệu liên quan sẽ bị xóa vĩnh viễn.</p>
              </div>
              <Button 
                variant="destructive" 
                className="rounded-xl font-bold gap-2"
                onClick={onDelete}
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
                Xóa vĩnh viễn
              </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
