"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Lock, Mail, CheckCircle2, Star } from "lucide-react"
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
        toast.error("Invalid credentials.")
        return
      }

      toast.success("Instructor login successful.")
      router.push("/instructor/dashboard")
      router.refresh()
    } catch (err) {
      toast.error("An error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Left Content */}
      <div className="space-y-10">
        <h1 className="text-6xl font-black tracking-tight leading-[1.1] text-zinc-900">
            Empower the next <br/>
            generation of <span className="text-[#FF6600]">thinkers.</span>
        </h1>
        <p className="text-lg text-zinc-500 font-medium leading-relaxed max-w-lg">
            Join over 5,000 professional educators delivering world-class curriculum through Belearning&apos;s intuitive instructor portal.
        </p>
        
        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
            <Image 
                src="/hero_vibe_coding_1778041166767.png" 
                alt="Instructor Portal" 
                width={800} 
                height={600} 
                className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-orange-600/90 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                <Star className="w-3.5 h-3.5 fill-white" />
                Premier Instructor Network
            </div>
        </div>
      </div>

      {/* Right Form Card */}
      <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[3rem] bg-white overflow-hidden p-12 md:p-16">
        <div className="mb-10">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 mb-3">Instructor Portal</h2>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
                Please enter your professional credentials to manage your curriculum.
            </p>
        </div>
        
        <CardContent className="p-0 space-y-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Professional Email</label>
                <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                        placeholder="instructor@belearning.com" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-16 rounded-2xl border-none bg-[#F1F3F5] pl-14 pr-6 text-sm font-medium focus-visible:ring-orange-500/20"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Password</label>
                    <button type="button" className="text-xs font-black uppercase tracking-widest text-[#FF6600]">Forgot password?</button>
                </div>
                <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                        placeholder="••••••••••••" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-16 rounded-2xl border-none bg-[#F1F3F5] pl-14 pr-6 text-sm font-medium focus-visible:ring-orange-500/20"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 ml-1">
                <Checkbox id="keep-logged" className="w-5 h-5 rounded-lg border-zinc-200 data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-none" />
                <label htmlFor="keep-logged" className="text-sm font-medium text-zinc-500 cursor-pointer">Keep me logged in for 30 days</label>
            </div>

            <Button type="submit" className="w-full h-16 rounded-2xl bg-[#FF6600] hover:bg-orange-600 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Log In as Instructor"}
            </Button>
          </form>

          <div className="pt-8 text-center space-y-6">
              <p className="text-sm font-medium text-zinc-400">New to our teaching community?</p>
              <Button asChild variant="outline" className="w-full h-16 rounded-full border-zinc-200 bg-white hover:bg-zinc-50 transition-all font-black text-sm text-zinc-900">
                  <Link href="/instructor-application">Create Instructor Account</Link>
              </Button>
          </div>
        </CardContent>

        <div className="mt-12 flex justify-center gap-8 text-[10px] text-zinc-400 font-black uppercase tracking-widest">
            <span className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                Secure Access
            </span>
            <span className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500" />
                24/7 Support
            </span>
        </div>
      </Card>
    </div>
  )
}
