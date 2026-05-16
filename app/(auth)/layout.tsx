import { ReactNode } from "react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-6xl flex flex-col items-center relative z-10 py-12 md:py-20">
        <div className="w-full flex justify-start mb-12 px-6 lg:px-0">
          <Link href="/" className="flex items-center gap-3 group transition-all">
            <div className="w-10 h-10 bg-[#FF6600] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-zinc-900">Belearning</span>
          </Link>
        </div>
        {children}
      </div>

      <div className="absolute bottom-12 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] pointer-events-none">
        Professional Learning Platform © 2024
      </div>
    </div>
  )
}
