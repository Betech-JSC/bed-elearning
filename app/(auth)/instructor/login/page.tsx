"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Lock, Mail, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import Image from "next/image"

export default function InstructorLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Email hoặc mật khẩu không chính xác.")
        return
      }

      toast.success("Đăng nhập giảng viên thành công.")
      router.push("/instructor/dashboard")
      router.refresh()
    } catch (err) {
      toast.error("Đã xảy ra lỗi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Left Content */}
      <div className="space-y-10">
        <h1 className="text-6xl font-black tracking-tight leading-[1.1] text-zinc-900">
            Trao quyền cho <br/>
            thế hệ <span className="text-[#FF6600]">tư duy mới.</span>
        </h1>
        <p className="text-base text-zinc-500 font-medium leading-relaxed max-w-lg">
            Tham gia cùng hơn 5.000 nhà giáo dục chuyên nghiệp đang cung cấp chương trình giảng dạy đẳng cấp thế giới thông qua cổng thông tin giảng viên trực quan của Belearning.
        </p>
        
        <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white group">
            <Image 
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80" 
                alt="Instructor Portal" 
                width={800} 
                height={600} 
                className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-orange-600/90 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                <Star className="w-3.5 h-3.5 fill-white" />
                Mạng lưới giảng viên hàng đầu
            </div>
        </div>
      </div>

      {/* Right Form Card */}
      <Card className="border border-zinc-100/80 shadow-2xl shadow-zinc-200/40 rounded-[2.5rem] bg-white overflow-hidden p-10 md:p-12">
        <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 mb-2">Cổng giảng viên</h2>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
                Vui lòng nhập thông tin đăng nhập của bạn để quản lý lớp học.
            </p>
        </div>
        
        <CardContent className="p-0 space-y-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email chuyên môn</label>
                <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                        placeholder="instructor@belearning.com" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-14 rounded-xl border border-zinc-200 bg-zinc-50/50 pl-12 pr-5 text-sm font-medium transition-all focus:bg-white focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mật khẩu</label>
                    <button type="button" className="text-xs font-black text-[#FF6600] hover:underline">Quên mật khẩu?</button>
                </div>
                <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                        placeholder="••••••••••••" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-14 rounded-xl border border-zinc-200 bg-zinc-50/50 pl-12 pr-5 text-sm font-medium transition-all focus:bg-white focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 ml-1 pt-1">
                <Checkbox id="keep-logged" className="w-4.5 h-4.5 rounded-md border-zinc-200 data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-[#FF6600]" />
                <label htmlFor="keep-logged" className="text-xs font-semibold text-zinc-500 cursor-pointer select-none">Duy trì đăng nhập trong 30 ngày</label>
            </div>

            <Button type="submit" className="w-full h-14 rounded-xl bg-[#FF6600] hover:bg-orange-600 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/10 border-none mt-2" disabled={isLoading}>
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <div className="pt-6 text-center space-y-4 border-t border-zinc-50">
              <p className="text-xs font-semibold text-zinc-400">Bạn là thành viên mới trong cộng đồng giảng dạy?</p>
              <Button asChild variant="outline" className="w-full h-14 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50 font-black text-xs text-zinc-700 transition-all">
                  <Link href="/instructor-application">Tạo tài khoản Giảng viên</Link>
              </Button>
          </div>
        </CardContent>

        <div className="mt-10 flex justify-center gap-8 text-[10px] text-zinc-400 font-black uppercase tracking-widest">
            <span className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                Truy cập bảo mật
            </span>
            <span className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500" />
                Hỗ trợ 24/7
            </span>
        </div>
      </Card>
    </div>
  )
}
