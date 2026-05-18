"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

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

      toast.success("Chào mừng bạn đã quay trở lại!")
      router.push(callbackUrl)
      router.refresh()
    } catch (err) {
      toast.error("Đã xảy ra lỗi trong quá trình đăng nhập.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl })
  }

  return (
    <div className="w-full max-w-[480px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 mb-2">Chào mừng quay trở lại</h1>
        <p className="text-zinc-500 font-medium text-sm">Đăng nhập để tiếp tục hành trình học tập của bạn</p>
      </div>

      <Card className="w-full border border-zinc-100/80 shadow-2xl shadow-zinc-200/40 rounded-[2.5rem] bg-white overflow-hidden p-8 md:p-10">
        <CardContent className="p-0 space-y-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input 
                  placeholder="name@example.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 rounded-xl border border-zinc-200 bg-zinc-50/50 pl-12 pr-5 text-sm font-medium transition-all focus:bg-white focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input 
                  placeholder="Nhập mật khẩu của bạn" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 rounded-xl border border-zinc-200 bg-zinc-50/50 pl-12 pr-12 text-sm font-medium transition-all focus:bg-white focus:border-[#FF6600] focus:ring-4 focus:ring-[#FF6600]/10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between ml-1 pt-1">
              <div className="flex items-center gap-2.5">
                <Checkbox id="remember" className="w-4.5 h-4.5 rounded-md border-zinc-200 data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-[#FF6600]" />
                <label htmlFor="remember" className="text-xs font-semibold text-zinc-500 cursor-pointer select-none">Ghi nhớ đăng nhập</label>
              </div>
              <button type="button" className="text-xs font-black text-[#FF6600] hover:underline">Quên mật khẩu?</button>
            </div>

            <Button type="submit" className="w-full h-14 rounded-xl bg-[#FF6600] hover:bg-orange-600 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/10 gap-2 border-none mt-2" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-100" />
            </div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
              <span className="bg-white px-4">Hoặc tiếp tục bằng</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="h-14 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50 font-bold text-xs gap-2.5 text-zinc-700 shadow-sm transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button 
              variant="outline" 
              type="button"
              onClick={() => handleSocialLogin("github")}
              className="h-14 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50 font-bold text-xs gap-2.5 text-zinc-700 shadow-sm transition-all"
            >
              <svg className="w-4.5 h-4.5 fill-current text-zinc-800" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.16.67-2.88 1.49-.62.71-1.16 1.85-1.01 2.96 1.07.08 2.18-.55 2.9-1.39z"/>
              </svg>
              Apple
            </Button>
          </div>

          <p className="text-center text-sm font-semibold text-zinc-500 pt-2">
            Chưa có tài khoản? <Link href="/register" className="text-[#FF6600] font-black hover:underline">Đăng ký miễn phí</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Đang tải...</div>}>
      <LoginContent />
    </Suspense>
  )
}
