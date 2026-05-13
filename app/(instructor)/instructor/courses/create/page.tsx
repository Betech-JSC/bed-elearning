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
import { Input } from "@/components/ui/input"
import { Loader2, ArrowRight, BookPlus } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Vui lòng nhập tiêu đề khóa học",
  }),
})

export default function CourseCreatePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/instructor/courses", {
        method: "POST",
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Đã có lỗi xảy ra")
      }

      const data = await response.json()
      toast.success("Khóa học đã được tạo thành công!")
      router.push(`/instructor/courses/${data.id}/edit`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-2xl shadow-sm">
          <BookPlus className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black">Đặt tên cho khóa học của bạn</h1>
          <p className="text-zinc-500 mt-1">Đừng lo lắng, bạn có thể thay đổi tiêu đề này bất cứ lúc nào.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-bold">Tiêu đề khóa học</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="VD: Lập trình Next.js thực chiến từ A-Z"
                    className="h-14 text-lg rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Bạn sẽ dạy gì trong khóa học này? Hãy đặt một cái tên thu hút học viên nhé.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2 pt-6">
            <Link href="/instructor/courses">
              <Button variant="ghost" type="button" className="h-12 px-6">
                Hủy bỏ
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isValid}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 font-bold gap-2 ml-auto"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Tiếp tục
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
