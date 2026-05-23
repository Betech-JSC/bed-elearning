"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { ShieldAlert, ArrowRight, Lock, User, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminLoginPage() {
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
        toast.error("Invalid credentials or insufficient permissions.")
        return
      }

      toast.success("Admin access granted.")
      window.location.href = "/admin/dashboard"
    } catch (err) {
      toast.error("An error occurred during authentication.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[3rem] bg-white overflow-hidden p-12 md:p-16">
        <div className="flex flex-col items-center text-center mb-12">
            <div className="w-16 h-16 bg-[#F1F3F5] rounded-2xl flex items-center justify-center text-zinc-400 mb-6">
                <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-3">Admin Access</h1>
            <p className="text-zinc-500 font-medium text-sm max-w-[280px] leading-relaxed">
                Authorized personnel only. Secure session encryption active.
            </p>
        </div>
        
        <CardContent className="p-0 space-y-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Employee ID or Email</label>
                <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                        placeholder="e.g. EMP-99234" 
                        type="text"
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
                    <button type="button" className="text-xs font-black uppercase tracking-widest text-[#FF6600]">Forgot?</button>
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

            <div className="bg-[#F1F3F5] rounded-2xl p-6 flex items-start gap-4">
                <Info className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-zinc-500 leading-relaxed">
                    Logging in will trigger a mandatory 2FA notification to your registered mobile device.
                </p>
            </div>

            <Button type="submit" className="w-full h-16 rounded-2xl bg-[#FF6600] hover:bg-orange-600 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20 gap-3" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Admin Access"}
                <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
        </CardContent>

        <div className="mt-12 pt-8 border-t border-zinc-50 text-center">
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] leading-relaxed max-w-[320px] mx-auto">
                All access attempts are logged and monitored for security purposes. Unauthorized access is strictly prohibited.
            </p>
        </div>
      </Card>
    </div>
  )
}
