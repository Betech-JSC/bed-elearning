import { Navbar } from "@/components/shared/navbar"
import Link from "next/link"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-zinc-900 pt-32 pb-20 rounded-t-[5rem] relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-4 gap-16 relative z-10">
          <div className="lg:col-span-1 space-y-8">
            <Link href="/" className="flex items-center gap-3 group transition-all">
                <div className="w-12 h-12 bg-[#FF6600] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform">
                    <span className="text-white font-black text-2xl">B</span>
                </div>
                <span className="text-3xl font-black tracking-tighter text-white">Belearning</span>
            </Link>
            <p className="text-zinc-400 font-medium leading-relaxed max-w-sm">
              Nâng tầm kiến thức toàn cầu thông qua công nghệ. Tham gia cộng đồng của chúng tôi và thay đổi sự nghiệp của bạn ngay hôm nay.
            </p>
            <div className="flex gap-5">
               <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#FF6600] hover:bg-zinc-700 shadow-sm cursor-pointer transition-all border border-zinc-700/50">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.411 2.865 8.139 6.839 9.465.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/></svg>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#FF6600] hover:bg-zinc-700 shadow-sm cursor-pointer transition-all border border-zinc-700/50">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
               </div>
            </div>
          </div>
          <div>
            <h4 className="font-black text-white mb-8 uppercase text-[10px] tracking-[0.2em] opacity-50">Nền tảng</h4>
            <ul className="space-y-4 text-sm font-bold text-zinc-500">
              <li><Link href="/courses" className="hover:text-[#FF6600] transition-colors">Khóa học</Link></li>
              <li><Link href="/instructors" className="hover:text-[#FF6600] transition-colors">Giảng viên</Link></li>
              <li><Link href="/pricing" className="hover:text-[#FF6600] transition-colors">Bảng giá</Link></li>
              <li><Link href="/certifications" className="hover:text-[#FF6600] transition-colors">Chứng chỉ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white mb-8 uppercase text-[10px] tracking-[0.2em] opacity-50">Công ty</h4>
            <ul className="space-y-4 text-sm font-bold text-zinc-500">
              <li><Link href="/about" className="hover:text-[#FF6600] transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/careers" className="hover:text-[#FF6600] transition-colors">Tuyển dụng</Link></li>
              <li><Link href="/blog" className="hover:text-[#FF6600] transition-colors">Tin tức</Link></li>
              <li><Link href="/contact" className="hover:text-[#FF6600] transition-colors">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white mb-8 uppercase text-[10px] tracking-[0.2em] opacity-50">Pháp lý</h4>
            <ul className="space-y-4 text-sm font-bold text-zinc-500">
              <li><Link href="/terms" className="hover:text-[#FF6600] transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link href="/privacy" className="hover:text-[#FF6600] transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/support" className="hover:text-[#FF6600] transition-colors">Hỗ trợ khách hàng</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-32 pt-10 border-t border-zinc-800 max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
          <p>&copy; 2024 Belearning. Powered by Advanced Technology.</p>
          <div className="flex gap-10">
            <span className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Tiếng Việt
            </span>
            <span className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                VND (₫)
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
