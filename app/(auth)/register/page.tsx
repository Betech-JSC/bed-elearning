"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Lock, Mail, User, ShieldCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Link from "next/link"
import Image from "next/image"

const formSchema = z.object({
  name: z.string().min(2, { message: "Tên phải chứa ít nhất 2 ký tự." }),
  email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ." }),
  password: z.string()
    .min(8, { message: "Mật khẩu phải chứa ít nhất 8 ký tự." })
    .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 số." }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ["confirmPassword"],
})

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        toast.success("Tạo tài khoản thành công!")
        router.push("/login")
      } else {
        const data = await response.json()
        toast.error(data.message || "Đã xảy ra lỗi.")
      }
    } catch (error) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 border border-zinc-100">
      {/* Left Side - Visual */}
      <div className="bg-[#FF6600] p-12 md:p-16 flex flex-col justify-between relative overflow-hidden group">
        <div className="relative z-10 space-y-10">
            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1]">
                Khơi dậy <br/> Tương lai
            </h1>
            <p className="text-white/80 font-medium text-base max-w-sm leading-relaxed">
                Tiếp cận nền giáo dục đẳng cấp thế giới được thiết kế để nâng tầm sự nghiệp và sự phát triển bản thân của bạn. Trải nghiệm môi trường học tập tập trung tối đa.
            </p>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 flex items-center gap-6 group-hover:scale-105 transition-transform duration-500 max-w-md">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#FF6600]" />
                </div>
                <div>
                    <p className="text-white font-black text-xs uppercase tracking-widest">Sức ảnh hưởng cộng đồng</p>
                    <p className="text-white/70 text-[11px] font-bold">Tham gia cùng hơn 10.000 học viên toàn cầu</p>
                </div>
            </div>
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="mt-16 relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20 aspect-video">
            <Image 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80" 
                alt="Create Account" 
                fill 
                className="object-cover grayscale brightness-125 opacity-40 group-hover:scale-110 transition-transform duration-1000"
            />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="p-12 md:p-16 flex flex-col justify-center">
        <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-2">Tạo tài khoản</h2>
            <p className="text-zinc-500 font-medium text-sm">Bắt đầu hành trình học tập của bạn ngay hôm nay.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Họ và tên</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input 
                            placeholder="Nguyễn Văn A" 
                            {...field} 
                            disabled={isLoading}
                            className="h-14 rounded-xl border border-zinc-200 bg-zinc-50/50 pl-12 pr-5 text-sm font-medium transition-all focus:bg-white focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10"
                        />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Địa chỉ Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input 
                            placeholder="name@example.com" 
                            type="email" 
                            {...field} 
                            disabled={isLoading}
                            className="h-14 rounded-xl border border-zinc-200 bg-zinc-50/50 pl-12 pr-5 text-sm font-medium transition-all focus:bg-white focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10"
                        />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input 
                                placeholder="••••••••" 
                                type="password" 
                                {...field} 
                                disabled={isLoading}
                                className="h-14 rounded-xl border border-zinc-200 bg-zinc-50/50 pl-12 pr-5 text-sm font-medium transition-all focus:bg-white focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10"
                            />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-red-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input 
                                placeholder="••••••••" 
                                type="password" 
                                {...field} 
                                disabled={isLoading}
                                className="h-14 rounded-xl border border-zinc-200 bg-zinc-50/50 pl-12 pr-5 text-sm font-medium transition-all focus:bg-white focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10"
                            />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-red-500" />
                    </FormItem>
                  )}
                />
            </div>

            <div className="flex items-start gap-3 ml-1 pt-2">
                <Checkbox id="terms" className="w-4.5 h-4.5 rounded-md border-zinc-200 data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-[#FF6600] mt-0.5" />
                <label htmlFor="terms" className="text-xs font-semibold text-zinc-500 cursor-pointer select-none leading-relaxed">
                    Tôi đồng ý với <Link href="/terms" className="text-[#FF6600] font-bold hover:underline">Điều khoản dịch vụ</Link> và <Link href="/privacy" className="text-[#FF6600] font-bold hover:underline">Chính sách bảo mật</Link>
                </label>
            </div>

            <Button type="submit" className="w-full h-14 rounded-xl bg-[#FF6600] hover:bg-orange-600 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/10 border-none mt-2" disabled={isLoading}>
                {isLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center">
            <p className="text-sm font-semibold text-zinc-500">
                Đã có tài khoản? <Link href="/login" className="text-[#FF6600] font-black hover:underline">Đăng nhập</Link>
            </p>
        </div>
      </div>
    </div>
  )
}
