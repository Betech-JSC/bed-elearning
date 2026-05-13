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
      <footer className="bg-zinc-950 text-zinc-400 py-12 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4 italic">Vibecode Academy</h3>
            <p className="text-sm">Nền tảng học Vibe Coding và AI hàng đầu Việt Nam. Tăng tốc sự nghiệp của bạn ngay hôm nay.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Học tập</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-white transition-colors">Tất cả khoá học</Link></li>
              <li><Link href="/courses?category=ai" className="hover:text-white transition-colors">Trí tuệ nhân tạo</Link></li>
              <li><Link href="/courses?category=web-development" className="hover:text-white transition-colors">Lập trình Web</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Công ty</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Liên hệ</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Cộng đồng</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Facebook Group</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Youtube</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-zinc-800 text-sm max-w-7xl mx-auto px-4 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Vibecode Academy. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white">Điều khoản</Link>
            <Link href="/privacy" className="hover:text-white">Bảo mật</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
