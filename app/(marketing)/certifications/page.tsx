"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Award, Search, ShieldCheck, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Link from "next/link"

export default function CertificationsSearchPage() {
  const router = useRouter()
  const [certId, setCertId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const cleanId = certId.trim()
    if (!cleanId) {
      toast.warning("Vui lòng nhập mã số chứng chỉ.")
      return
    }

    setIsLoading(true)
    // Redirect to the certification detail page
    router.push(`/certifications/${cleanId}`)
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pt-32 pb-24 flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl -z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl -z-0 pointer-events-none" />

      {/* Main Search Container */}
      <div className="max-w-2xl w-full mx-auto px-6 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Verification Icon & Badge */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100/50 dark:border-orange-900/30 mb-2">
            <ShieldCheck className="w-5 h-5 text-[#FF6600]" />
            <span className="text-[10px] font-black text-[#FF6600] uppercase tracking-widest">Hệ thống xác thực Belearning</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            Tra cứu <span className="text-[#FF6600]">Chứng chỉ</span> Công khai
          </h1>
          
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-base md:text-lg leading-relaxed max-w-lg mx-auto">
            Nhập mã số định danh chứng chỉ (UUID) được in trên chứng chỉ hoặc trong tài khoản học viên để xác thực trực tuyến tính nguyên bản.
          </p>
        </div>

        {/* Search Card */}
        <div className="mt-12 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 dark:shadow-none relative group">
          {/* Inner vintage border like certificate */}
          <div className="absolute inset-4 border border-dashed border-orange-100/60 dark:border-zinc-800/80 rounded-[2rem] pointer-events-none" />
          
          <form onSubmit={handleSearch} className="relative z-10 space-y-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400 group-focus-within:text-[#FF6600] transition-colors" />
              <Input 
                type="text"
                placeholder="Ví dụ: c3f7a1b2-c8e9-4d6f-8a0b-1c2d3e4f5g6h" 
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                disabled={isLoading}
                className="pl-14 pr-6 h-16 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-800 shadow-inner text-sm font-medium focus-visible:ring-[#FF6600]/20 focus-visible:border-[#FF6600] dark:focus-visible:border-orange-500 transition-all placeholder:text-zinc-400" 
              />
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-16 rounded-2xl bg-zinc-900 hover:bg-[#FF6600] text-white font-black text-xs uppercase tracking-widest gap-2.5 shadow-xl shadow-zinc-900/10 hover:shadow-orange-500/10 active:scale-[0.98] transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang truy xuất thông tin...
                </>
              ) : (
                <>
                  Tra cứu chứng nhận
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer info link */}
        <div className="text-center pt-8 relative z-10">
          <Button asChild variant="link" className="text-zinc-400 hover:text-[#FF6600] text-xs font-bold gap-1.5 transition-colors">
            <Link href="/">
              Quay về Trang chủ Belearning
            </Link>
          </Button>
        </div>

      </div>
    </div>
  )
}
