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
import Image from "next/image"

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
        toast.error("Invalid email or password.")
        return
      }

      toast.success("Welcome back!")
      router.push(callbackUrl)
      router.refresh()
    } catch (err) {
      toast.error("An error occurred during login.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl })
  }

  return (
    <div className="w-full max-w-[500px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 mb-2">Welcome back, learner</h1>
          <p className="text-zinc-500 font-medium text-sm">Log in to continue your education journey</p>
      </div>

      <Card className="w-full border-none shadow-2xl shadow-zinc-200/50 rounded-[3rem] bg-white overflow-hidden p-10 md:p-12">
        <CardContent className="p-0 space-y-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                        placeholder="name@example.com" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-16 rounded-2xl border-none bg-[#F1F3F5] pl-14 pr-6 text-sm font-medium focus-visible:ring-orange-500/20"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                        placeholder="Enter your password" 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-16 rounded-2xl border-none bg-[#F1F3F5] pl-14 pr-14 text-sm font-medium focus-visible:ring-orange-500/20"
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between ml-1">
                <div className="flex items-center gap-3">
                    <Checkbox id="remember" className="w-5 h-5 rounded-lg border-zinc-200 data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-none" />
                    <label htmlFor="remember" className="text-sm font-medium text-zinc-500 cursor-pointer">Remember me</label>
                </div>
                <button type="button" className="text-sm font-black text-[#FF6600] hover:underline">Forgot password?</button>
            </div>

            <Button type="submit" className="w-full h-16 rounded-2xl bg-[#FF6600] hover:bg-orange-600 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20 gap-3" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
                <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-100" />
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              <span className="bg-white px-4">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="h-16 rounded-2xl border-zinc-100 hover:bg-zinc-50 font-black text-xs gap-3"
              >
                  <Image src="/google.svg" alt="Google" width={20} height={20} />
                  Google
              </Button>
              <Button 
                variant="outline" 
                type="button"
                onClick={() => handleSocialLogin("github")}
                className="h-16 rounded-2xl border-zinc-100 hover:bg-zinc-50 font-black text-xs gap-3"
              >
                  <Image src="/apple.svg" alt="Apple" width={20} height={20} />
                  Apple
              </Button>
          </div>

          <p className="text-center text-sm font-medium text-zinc-500 pt-4">
              Don&apos;t have an account? <Link href="/register" className="text-[#FF6600] font-black hover:underline">Sign up for free</Link>
          </p>
        </CardContent>
      </Card>

      <div className="mt-12 w-full px-4">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white aspect-[21/9]">
              <Image 
                src="/hero_vibe_coding_1778041166767.png" 
                alt="Learner" 
                fill 
                className="object-cover"
              />
          </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
