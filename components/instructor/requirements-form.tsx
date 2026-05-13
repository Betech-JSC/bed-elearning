"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Target, ListChecks, Users } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  whatYouWillLearn: z.string().optional(),
  requirements: z.string().optional(),
  targetAudience: z.string().optional(),
})

interface RequirementsFormProps {
  initialData: any
}

export function RequirementsForm({ initialData }: RequirementsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whatYouWillLearn: initialData.whatYouWillLearn || "",
      requirements: initialData.requirements || "",
      targetAudience: initialData.targetAudience || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/instructor/courses/${initialData.id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Cập nhật thất bại")

      toast.success("Đã cập nhật yêu cầu & đối tượng!")
      router.refresh()
    } catch (error) {
      toast.error("Đã có lỗi xảy ra.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
        <FormField
          control={form.control}
          name="whatYouWillLearn"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                Học viên sẽ đạt được gì?
              </FormLabel>
              <FormControl>
                <Textarea 
                  disabled={isLoading} 
                  placeholder="VD: Xây dựng được ứng dụng web hoàn chỉnh với Next.js..." 
                  {...field} 
                  rows={4}
                  className="rounded-xl"
                />
              </FormControl>
              <FormDescription>Liệt kê các kỹ năng học viên sẽ có sau khi hoàn thành khóa học.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-orange-600" />
                Yêu cầu đầu vào
              </FormLabel>
              <FormControl>
                <Textarea 
                  disabled={isLoading} 
                  placeholder="VD: Kiến thức cơ bản về HTML/CSS/JS..." 
                  {...field} 
                  rows={4}
                  className="rounded-xl"
                />
              </FormControl>
              <FormDescription>Các kiến thức hoặc công cụ cần thiết trước khi bắt đầu học.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Đối tượng học viên
              </FormLabel>
              <FormControl>
                <Textarea 
                  disabled={isLoading} 
                  placeholder="VD: Sinh viên công nghệ thông tin, lập trình viên muốn chuyển đổi..." 
                  {...field} 
                  rows={4}
                  className="rounded-xl"
                />
              </FormControl>
              <FormDescription>Khóa học này dành cho ai?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} className="gap-2 bg-blue-600 hover:bg-blue-700 h-12 px-8 font-bold text-md">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu thiết lập
          </Button>
        </div>
      </form>
    </Form>
  )
}
