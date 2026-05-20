import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone, Send, Clock, Sparkles } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Liên hệ | Belearning",
  description: "Liên hệ với đội ngũ Betech để được hỗ trợ",
}

export default function ContactPage() {
  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-6 mb-20 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="flex justify-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-2xl shadow-sm">
                 <Sparkles className="w-4 h-4 text-[#FF6600]" />
                 <span className="text-[11px] font-black text-[#FF6600] uppercase tracking-[0.2em]">Hỗ trợ 24/7</span>
             </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900">
            Trò chuyện cùng <span className="text-[#FF6600]">Betech</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Bạn có câu hỏi, đề xuất hay cần hỗ trợ? Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Thông tin liên hệ */}
          <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-xl shadow-zinc-200/50 space-y-8">
              <h3 className="text-2xl font-black text-zinc-900 mb-6">Thông tin liên hệ</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#FF6600]" />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 mb-1">Công ty</p>
                    <p className="text-zinc-500 font-medium text-sm">Betech Digital</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#FF6600]" />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 mb-1">Điện thoại</p>
                    <p className="text-zinc-500 font-medium text-sm">077 560 0351</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#FF6600]" />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 mb-1">Email</p>
                    <p className="text-zinc-500 font-medium text-sm">admin@betech-digital.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#FF6600]" />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 mb-1">Giờ làm việc</p>
                    <p className="text-zinc-500 font-medium text-sm">Thứ 2 - Thứ 6: 08:00 - 18:00</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-100">
                <p className="font-black text-zinc-900 mb-4">Kết nối với chúng tôi</p>
                <div className="flex gap-4">
                  <Link href="https://www.facebook.com/betech.digital" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-zinc-900 hover:bg-[#1877F2] hover:-translate-y-1 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg shadow-zinc-200">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 fill-current">
                       <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Form liên hệ */}
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-zinc-100 shadow-xl shadow-zinc-200/50">
              <h3 className="text-3xl font-black text-zinc-900 mb-8 tracking-tight">Gửi lời nhắn cho chúng tôi</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Họ và tên</label>
                    <input 
                      type="text" 
                      placeholder="Nguyễn Văn A" 
                      className="w-full h-14 bg-[#F8F9FA] border-none rounded-2xl px-6 font-medium focus:ring-2 focus:ring-[#FF6600] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Email</label>
                    <input 
                      type="email" 
                      placeholder="email@example.com" 
                      className="w-full h-14 bg-[#F8F9FA] border-none rounded-2xl px-6 font-medium focus:ring-2 focus:ring-[#FF6600] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Chủ đề</label>
                  <input 
                    type="text" 
                    placeholder="Bạn cần hỗ trợ về vấn đề gì?" 
                    className="w-full h-14 bg-[#F8F9FA] border-none rounded-2xl px-6 font-medium focus:ring-2 focus:ring-[#FF6600] outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Nội dung</label>
                  <textarea 
                    placeholder="Nhập nội dung chi tiết..." 
                    rows={6}
                    className="w-full bg-[#F8F9FA] border-none rounded-3xl p-6 font-medium focus:ring-2 focus:ring-[#FF6600] outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <Button type="button" size="lg" className="h-16 px-12 rounded-2xl bg-[#FF6600] hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95 border-none gap-3">
                  Gửi tin nhắn <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
