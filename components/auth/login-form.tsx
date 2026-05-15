"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { signIn } from "next-auth/react"

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
import { ShieldCheck, GraduationCap, Laptop } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN"
  title: string
  description: string
  callbackUrl?: string
  showGoogle?: boolean
}

export const LoginForm = ({ 
  role, 
  title, 
  description, 
  callbackUrl = "/", 
  showGoogle = true 
}: LoginFormProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Email hoặc mật khẩu không đúng.")
        return
      }

      toast.success("Đăng nhập thành công!")
      router.push(callbackUrl)
      router.refresh()
    } catch (err) {
      toast.error("Đã xảy ra lỗi hệ thống.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    signIn("google", { callbackUrl })
  }

  const RoleIcon = role === "ADMIN" ? ShieldCheck : role === "INSTRUCTOR" ? Laptop : GraduationCap

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden">
      <CardHeader className="space-y-2 pb-8 pt-10 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-blue-600/20">
           <RoleIcon className="w-8 h-8" />
        </div>
        <CardTitle className="text-3xl font-black tracking-tight">{title}</CardTitle>
        <CardDescription className="text-zinc-500 font-medium px-4">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showGoogle && (
          <>
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-2xl font-bold border-zinc-200 hover:bg-zinc-50 gap-3" 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Tiếp tục với Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-zinc-400">
                <span className="bg-white dark:bg-zinc-950 px-4">HOẶC</span>
              </div>
            </div>
          </>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-black uppercase text-zinc-500">Email công việc</FormLabel>
                  <FormControl>
                    <Input placeholder="name@company.com" className="h-12 rounded-xl bg-zinc-50 border-none focus:ring-2 focus:ring-blue-500" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-black uppercase text-zinc-500">Mật khẩu</FormLabel>
                    <Link href="/forgot-password" className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-tight">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" className="h-12 rounded-xl bg-zinc-50 border-none focus:ring-2 focus:ring-blue-500" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-black font-black text-white shadow-xl shadow-zinc-900/10" disabled={isLoading}>
              {isLoading ? "Đang xác thực..." : "Đăng nhập ngay"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pb-10 pt-4 text-center">
        {role === "STUDENT" && (
          <div className="text-sm font-medium text-zinc-500">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Đăng ký miễn phí
            </Link>
          </div>
        )}
        <Link href="/" className="text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors">
          Quay lại trang chủ
        </Link>
      </CardFooter>
    </Card>
  )
}
