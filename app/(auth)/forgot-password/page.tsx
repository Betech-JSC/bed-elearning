"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const forgotSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(data: ForgotFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      })

      if (!response.ok) {
        toast.error("Đã xảy ra lỗi khi gửi yêu cầu.")
        return
      }

      setIsSubmitted(true)
      toast.success("Đã gửi link khôi phục mật khẩu vào email của bạn.")
    } catch (err) {
      console.error(err)
      toast.error("Đã xảy ra lỗi hệ thống.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-zinc-200 dark:border-zinc-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Khôi phục mật khẩu</CardTitle>
        <CardDescription>
          Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm text-center">
            Chúng tôi đã gửi link đặt lại mật khẩu tới <strong>{form.getValues("email")}</strong>. Vui lòng kiểm tra hộp thư đến (và thư rác).
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" type="email" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Gửi link khôi phục"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-sm text-center text-zinc-500">
        <div>
          Nhớ mật khẩu rồi?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Quay lại Đăng nhập
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
