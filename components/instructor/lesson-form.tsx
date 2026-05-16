"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Video, 
  FileText, 
  Eye, 
  Trash2,
  Loader2,
  Save
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Editor } from "@/components/instructor/editor"
import { Switch } from "@/components/ui/switch"
import { updateLesson, deleteLesson } from "@/lib/actions/instructor"

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề bài học"),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  isFreePreview: z.boolean().default(false),
})

type LessonFormValues = z.infer<typeof formSchema>

interface LessonFormProps {
  courseId: string
  lesson: any
}

export function LessonForm({ courseId, lesson }: LessonFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: lesson.title || "",
      description: lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      isFreePreview: lesson.isFreePreview || false,
    },
  })

  async function onSubmit(data: LessonFormValues) {
    try {
      setIsLoading(true)
      await updateLesson(courseId, lesson.id, data)
      toast.success("Đã cập nhật bài học!")
      router.refresh()
    } catch (error) {
      toast.error("Đã có lỗi xảy ra.")
    } finally {
      setIsLoading(false)
    }
  }

  async function onDelete() {
    try {
      setIsLoading(true)
      if (confirm("Bạn có chắc chắn muốn xóa bài học này?")) {
        await deleteLesson(courseId, lesson.id)
        toast.success("Đã xóa bài học!")
        router.push(`/instructor/courses/${courseId}/edit`)
      }
    } catch (error) {
      toast.error("Xóa thất bại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/instructor/courses/${courseId}/edit`}>
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black">Thiết lập bài học</h1>
            <p className="text-sm text-zinc-500">Hoàn thiện nội dung và cài đặt cho bài giảng này.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={onDelete} disabled={isLoading}>
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa bài học
           </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-lg font-bold border-b pb-4">
                <LayoutDashboard className="w-5 h-5 text-blue-600" />
                Nội dung bài học
              </div>
              
              <FormField
                control={form.control as any}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Tiêu đề bài giảng</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: Giới thiệu về khóa học..." {...field} disabled={isLoading} className="h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Nội dung chi tiết (Text content)</FormLabel>
                    <FormControl>
                      <Editor {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Viết nội dung bài giảng, chèn mã nguồn hoặc hình ảnh hướng dẫn.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-lg font-bold border-b pb-4">
                  <Video className="w-5 h-5 text-purple-600" />
                  Video & Truy cập
                </div>

                <FormField
                  control={form.control as any}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Nội dung Video</FormLabel>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                           <p className="text-xs text-zinc-500 font-medium">Cách 1: Sử dụng đường dẫn (URL)</p>
                           <FormControl>
                            <Input placeholder="Youtube, Vimeo hoặc Mux URL..." {...field} disabled={isLoading} className="h-11 rounded-xl" />
                          </FormControl>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                           <p className="text-xs text-zinc-500 font-medium">Cách 2: Tải video trực tiếp</p>
                           <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 bg-zinc-50/50 hover:bg-zinc-50 transition-colors cursor-pointer group"
                             onClick={() => document.getElementById('video-upload')?.click()}
                           >
                              <input 
                                type="file" 
                                id="video-upload" 
                                className="hidden" 
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    toast.info(`Đang giả lập tải lên: ${file.name}`)
                                    // In real implementation, you would use Mux Direct Upload here
                                    setTimeout(() => {
                                      toast.success("Tải video lên thành công (Giả lập)")
                                      field.onChange("https://example.com/demo-video.mp4")
                                    }, 2000)
                                  }
                                }}
                              />
                              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Video className="w-6 h-6 text-blue-600" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-bold">Nhấn để tải video lên</p>
                                <p className="text-[10px] text-zinc-500">MP4, MOV, AVI (Tối đa 500MB)</p>
                              </div>
                           </div>
                        </div>
                      </div>
                      <FormDescription>Chọn một trong hai cách để thêm video cho bài giảng.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="isFreePreview"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border p-4 bg-zinc-50/50">
                      <div className="space-y-0.5">
                        <FormLabel className="font-bold">Xem thử miễn phí</FormLabel>
                        <FormDescription className="text-xs">
                          Cho phép học viên xem bài này mà không cần mua khóa học.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Lưu thay đổi
                </Button>
             </div>

             <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6">
                <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2 text-sm">
                   <FileText className="w-4 h-4" />
                   Mẹo nhỏ
                </h3>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/60 leading-relaxed">
                   Một bài giảng kết hợp cả Video và nội dung Text chi tiết sẽ giúp học viên dễ dàng theo dõi và tra cứu lại thông tin sau này.
                </p>
             </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
