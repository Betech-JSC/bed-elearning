import { Button } from "@/components/ui/button"
import { HelpCircle, FileText, Settings, PlayCircle, BookOpen, MessageCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Trung tâm Hỗ trợ | Belearning",
  description: "Tài liệu hướng dẫn và câu hỏi thường gặp trên Belearning",
}

export default function SupportPage() {
  const topics = [
    { title: "Bắt đầu sử dụng", icon: PlayCircle, desc: "Hướng dẫn cơ bản cho người mới" },
    { title: "Quản lý tài khoản", icon: Settings, desc: "Bảo mật, đổi mật khẩu và hồ sơ" },
    { title: "Thanh toán & Hóa đơn", icon: FileText, desc: "Quy trình thanh toán và hoàn tiền" },
    { title: "Trải nghiệm học tập", icon: BookOpen, desc: "Video player, bài tập và tiến độ" },
  ]

  const faqs = [
    {
      q: "Làm thế nào để tải xuống ứng dụng di động?",
      a: "Hiện tại Belearning hoạt động hoàn hảo trên trình duyệt web của thiết bị di động. Ứng dụng gốc (Native App) đang trong quá trình phát triển và sẽ sớm ra mắt."
    },
    {
      q: "Tôi quên mật khẩu, làm thế nào để lấy lại?",
      a: "Bạn có thể nhấp vào nút 'Quên mật khẩu' trên trang Đăng nhập. Một liên kết đặt lại mật khẩu sẽ được gửi đến địa chỉ email đã đăng ký của bạn."
    },
    {
      q: "Chứng chỉ của tôi có giá trị không?",
      a: "Chứng chỉ từ Belearning là chứng nhận hoàn thành khóa học hợp lệ. Mặc dù không tương đương với bằng cấp đại học chính quy, nhưng được các doanh nghiệp đánh giá cao để chứng minh kỹ năng thực tế."
    },
    {
      q: "Video bài giảng không tải được, tôi phải làm sao?",
      a: "Vui lòng kiểm tra lại kết nối mạng. Nếu sự cố vẫn tiếp diễn, hãy thử xóa bộ nhớ cache (cache) của trình duyệt hoặc sử dụng một trình duyệt khác. Đảm bảo rằng bạn không sử dụng các tiện ích chặn quảng cáo quá mức có thể chặn script video (Mux)."
    }
  ]

  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-32 pb-24">
      {/* Header */}
      <div className="bg-zinc-900 absolute top-0 left-0 w-full h-[500px] -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#FF6600]/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-8 mb-24 pt-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
            Chúng tôi có thể giúp gì cho bạn?
          </h1>
          <div className="max-w-2xl mx-auto relative">
             <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                 <HelpCircle className="w-6 h-6 text-zinc-400" />
             </div>
             <input 
               type="text" 
               placeholder="Tìm kiếm câu hỏi, hướng dẫn, từ khóa..." 
               className="w-full h-20 bg-white border-none rounded-full pl-16 pr-8 text-lg font-medium shadow-2xl focus:ring-4 focus:ring-[#FF6600]/50 outline-none transition-all"
             />
          </div>
        </div>

        {/* Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
           {topics.map((topic, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-2 transition-transform duration-500 cursor-pointer group">
                 <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FF6600] transition-colors duration-500">
                    <topic.icon className="w-7 h-7 text-[#FF6600] group-hover:text-white transition-colors duration-500" />
                 </div>
                 <h3 className="text-xl font-black text-zinc-900 mb-2">{topic.title}</h3>
                 <p className="text-zinc-500 font-medium text-sm leading-relaxed">{topic.desc}</p>
              </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
           <div className="lg:col-span-2 space-y-8">
              <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Câu hỏi thường gặp</h2>
              <div className="space-y-6">
                 {faqs.map((faq, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm">
                       <h4 className="text-lg font-black text-zinc-900 mb-4">{faq.q}</h4>
                       <p className="text-zinc-600 font-medium leading-relaxed">{faq.a}</p>
                    </div>
                 ))}
              </div>
           </div>

           <div className="lg:col-span-1">
              <div className="bg-zinc-900 text-white p-10 rounded-[3rem] border border-zinc-800 shadow-2xl sticky top-32">
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                    <MessageCircle className="w-8 h-8 text-[#FF6600]" />
                 </div>
                 <h3 className="text-2xl font-black mb-4">Vẫn cần hỗ trợ?</h3>
                 <p className="text-zinc-400 font-medium mb-10 leading-relaxed">
                    Nếu bạn không tìm thấy câu trả lời trong các tài liệu trên, đừng ngần ngại liên hệ với đội ngũ CSKH của chúng tôi.
                 </p>
                 <Button asChild className="w-full h-16 rounded-2xl bg-[#FF6600] hover:bg-orange-600 font-black text-xs uppercase tracking-widest border-none gap-3">
                    <Link href="/contact">
                       Liên hệ ngay <ArrowRight className="w-4 h-4" />
                    </Link>
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
