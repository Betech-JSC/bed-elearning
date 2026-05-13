"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const schema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự").max(100),
})

type FormValues = z.infer<typeof schema>

interface CreateCourseFormProps {
  instructorId: string
}

export function CreateCourseForm({ instructorId }: CreateCourseFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { title: "" },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    try {
      const res = await fetch("/api/instructor/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: data.title, instructorId }),
      })
      if (!res.ok) throw new Error()
      const course = await res.json()
      toast.success("Tạo khóa học thành công!")
      router.push(`/instructor/courses/${course.id}`)
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control as any}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-base">Tiêu đề khóa học</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: Xây dựng Web App hoàn chỉnh với Next.js 15"
                  className="h-12 rounded-xl text-base"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" className="rounded-xl font-bold px-8" disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tiếp tục"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
