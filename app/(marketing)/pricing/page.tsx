import { Button } from "@/components/ui/button"
import { CheckCircle, X, Sparkles, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Bảng giá | Belearning",
  description: "Các gói học tập và định giá trên hệ thống Belearning",
}

export default function PricingPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      {/* Header */}
      <div className="text-center space-y-6 max-w-3xl mx-auto px-6 mb-20 animate-in fade-in slide-in-from-top-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-2xl shadow-sm">
            <Sparkles className="w-4 h-4 text-[#FF6600]" />
            <span className="text-[11px] font-black text-[#FF6600] uppercase tracking-[0.2em]">Đầu tư cho tương lai</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900">
          Mua một lần. <br />
          <span className="text-[#FF6600]">Học trọn đời.</span>
        </h1>
        <p className="text-zinc-500 font-medium text-lg leading-relaxed">
          Belearning không áp dụng mô hình đăng ký trả phí hàng tháng (Subscription). Bạn chỉ cần thanh toán một lần cho khóa học mình muốn và sở hữu nó mãi mãi.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-[#F8F9FA] rounded-[3rem] p-10 border border-zinc-100 shadow-sm flex flex-col animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
            <div className="space-y-4 mb-8">
              <h3 className="text-2xl font-black text-zinc-900">Trải nghiệm Miễn phí</h3>
              <p className="text-zinc-500 font-medium">Bắt đầu học tập ngay hôm nay mà không cần thẻ tín dụng.</p>
            </div>
            <div className="text-5xl font-black text-zinc-900 tracking-tighter mb-10">0₫</div>
            
            <div className="space-y-4 mb-10 flex-1">
              {[
                "Tiếp cận 100+ khóa học miễn phí",
                "Video chất lượng cao (HD)",
                "Cộng đồng hỗ trợ cơ bản",
                "Tiến độ học tập được lưu tự động",
                "Không có chứng chỉ tốt nghiệp",
                "Có chứa quảng cáo hệ thống"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 text-zinc-600 font-medium">
                  {i < 4 ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> : <X className="w-5 h-5 text-zinc-300 shrink-0" />}
                  <span className={cn(i >= 4 && "text-zinc-400")}>{feature}</span>
                </div>
              ))}
            </div>

            <Button asChild variant="outline" className="h-16 rounded-2xl border-zinc-200 font-black text-xs uppercase tracking-widest hover:bg-zinc-50 bg-white">
              <Link href="/courses?price=free">Khám phá khóa Miễn phí</Link>
            </Button>
          </div>

          {/* Premium Tier */}
          <div className="bg-zinc-900 rounded-[3rem] p-10 border border-zinc-800 shadow-2xl shadow-zinc-900/20 flex flex-col relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
                <div className="space-y-4 mb-8">
                <div className="inline-flex items-center gap-2 bg-[#FF6600]/10 text-[#FF6600] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#FF6600]/20">
                    Phổ biến nhất
                </div>
                <h3 className="text-2xl font-black text-white">Khóa học Trả phí</h3>
                <p className="text-zinc-400 font-medium">Đầu tư vào kỹ năng chuyên sâu với các chuyên gia hàng đầu.</p>
                </div>
                
                <div className="mb-10">
                    <span className="text-5xl font-black text-white tracking-tighter">Từ 499K</span>
                    <span className="text-zinc-500 font-bold ml-2">/ khóa học</span>
                </div>
                
                <div className="space-y-4 mb-10 flex-1">
                {[
                    "Sở hữu vĩnh viễn khóa học",
                    "Cập nhật nội dung miễn phí trọn đời",
                    "Video chất lượng cao (4K/FullHD)",
                    "Tài liệu thực hành & mã nguồn",
                    "Cấp chứng chỉ điện tử sau khi hoàn thành",
                    "Hỏi đáp trực tiếp cùng Giảng viên",
                    "Hoàn toàn không có quảng cáo"
                ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 text-zinc-300 font-medium">
                    <CheckCircle className="w-5 h-5 text-[#FF6600] shrink-0" />
                    <span>{feature}</span>
                    </div>
                ))}
                </div>

                <Button asChild className="w-full h-16 rounded-2xl bg-[#FF6600] hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 border-none gap-3 transition-all hover:scale-[1.02] active:scale-95">
                  <Link href="/courses">
                     Mua khóa học ngay <Zap className="w-4 h-4" />
                  </Link>
                </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-3xl mx-auto space-y-12">
            <h2 className="text-3xl font-black text-center text-zinc-900 tracking-tight">Câu hỏi thường gặp</h2>
            <div className="space-y-6">
               <div className="bg-[#F8F9FA] p-8 rounded-[2rem] border border-zinc-100">
                  <h4 className="text-lg font-black text-zinc-900 mb-3">Làm thế nào để thanh toán?</h4>
                  <p className="text-zinc-600 font-medium leading-relaxed">Chúng tôi hỗ trợ thanh toán qua Thẻ tín dụng/Ghi nợ quốc tế (Stripe), Chuyển khoản ngân hàng trực tiếp (VNPay), và quét mã QR Code (SePay). Quá trình kích hoạt khóa học hoàn toàn tự động ngay sau khi thanh toán.</p>
               </div>
               <div className="bg-[#F8F9FA] p-8 rounded-[2rem] border border-zinc-100">
                  <h4 className="text-lg font-black text-zinc-900 mb-3">Tôi có bị giới hạn thời gian học không?</h4>
                  <p className="text-zinc-600 font-medium leading-relaxed">Không. Khi bạn mua một khóa học, bạn sẽ có quyền truy cập vào nội dung đó trọn đời, bao gồm cả các bản cập nhật nội dung trong tương lai mà không phải trả thêm bất kỳ chi phí nào.</p>
               </div>
               <div className="bg-[#F8F9FA] p-8 rounded-[2rem] border border-zinc-100">
                  <h4 className="text-lg font-black text-zinc-900 mb-3">Tôi có được hoàn tiền không?</h4>
                  <p className="text-zinc-600 font-medium leading-relaxed">Có, chúng tôi có chính sách hoàn tiền trong vòng 7 ngày kể từ khi thanh toán nếu bạn chưa hoàn thành quá 20% thời lượng của khóa học đó. Xin vui lòng liên hệ đội ngũ hỗ trợ để được giải quyết.</p>
               </div>
            </div>
        </div>
      </div>
    </div>
  )
}
