"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Globe, DollarSign, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"

export default function InstructorApplicationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [specialty, setSpecialty] = useState("")

  const specialtyLabels: Record<string, string> = {
    it: "Công nghệ thông tin",
    business: "Kinh doanh & Quản lý",
    design: "Nghệ thuật & Thiết kế sáng tạo",
    language: "Ngôn ngữ học",
    science: "Khoa học Ứng dụng",
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      toast.success("Gửi đơn đăng ký thành công! Hội đồng Học thuật sẽ sớm xem xét hồ sơ của bạn.")
      router.push("/")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center space-y-8 mb-20 animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500/5 to-amber-500/5 border border-orange-200/50 rounded-full shadow-sm">
                <Star className="w-3.5 h-3.5 text-[#FF6600] fill-[#FF6600]" />
                <span className="text-[11px] font-black text-[#FF6600] uppercase tracking-wider">Mạng lưới Giảng viên Tinh hoa</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-tight text-zinc-900">
                Kiến tạo Tương lai <br/> 
                <span className="bg-gradient-to-r from-[#FF6600] to-amber-500 bg-clip-text text-transparent">
                    Giáo dục Toàn cầu.
                </span>
            </h1>
            <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                Gia nhập cộng đồng giảng viên đẳng cấp thế giới và các chuyên gia đầu ngành. Chia sẻ kiến thức của bạn với hàng triệu học viên trên khắp thế giới cùng Belearning.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start w-full">
            {/* Left Column - Benefits */}
            <div className="lg:col-span-5 space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
                <div className="space-y-10">
                    <h3 className="text-2xl font-black text-[#8B3D00]">Tại sao nên giảng dạy tại đây?</h3>
                    
                    <div className="space-y-8">
                        <div className="flex gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 shrink-0 border border-zinc-100">
                                <Globe className="w-6 h-6 text-[#FF6600]" />
                            </div>
                            <div>
                                <h4 className="font-black text-zinc-900 mb-1">Tác động Toàn cầu</h4>
                                <p className="text-zinc-500 text-sm font-medium leading-relaxed">Tiếp cận học viên tại hơn 190 quốc gia và tạo nên sự khác biệt lớn trong giáo dục.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 shrink-0 border border-zinc-100">
                                <DollarSign className="w-6 h-6 text-[#FF6600]" />
                            </div>
                            <div>
                                <h4 className="font-black text-zinc-900 mb-1">Chia sẻ Doanh thu</h4>
                                <p className="text-zinc-500 text-sm font-medium leading-relaxed">Thu nhập hấp dẫn và cạnh tranh dựa trên chuyên môn của bạn với chính sách đối soát hàng tháng.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5 shrink-0 border border-zinc-100">
                                <Zap className="w-6 h-6 text-[#FF6600]" />
                            </div>
                            <div>
                                <h4 className="font-black text-zinc-900 mb-1">Công cụ Cao cấp</h4>
                                <p className="text-zinc-500 text-sm font-medium leading-relaxed">Sử dụng hệ thống quản trị khóa học tối tân cùng sự hỗ trợ kỹ thuật sản xuất chuyên nghiệp.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                    <Image 
                        src="/nguyen-cong-toan.png" 
                        alt="Anh Nguyễn Công Toàn - Giám đốc Betech" 
                        width={600} 
                        height={600} 
                        className="w-full h-[450px] object-cover object-top group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10">
                        <p className="text-white font-bold italic text-base leading-relaxed mb-4">
                            &quot;Tại Betech, chúng tôi tin rằng công nghệ và giáo dục số là chìa khóa mở ra tương lai. Belearning chính là cầu nối tuyệt vời để lan tỏa những giá trị tri thức thực chiến đến với cộng đồng học viên.&quot; — Anh Nguyễn Công Toàn, Giám đốc Betech
                        </p>
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-8 duration-1000 delay-400">
                <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[4rem] bg-white overflow-hidden p-12 md:p-16">
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-zinc-900 mb-3">Đơn đăng ký Giảng viên</h2>
                        <p className="text-zinc-500 font-medium">Vui lòng điền thông tin chi tiết của bạn để gửi cho Hội đồng Học thuật.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Họ và tên</label>
                                <Input 
                                    placeholder="Ví dụ: Nguyễn Văn A" 
                                    className="h-16 rounded-2xl border-none bg-[#F1F3F5] px-6 text-sm font-medium focus-visible:ring-orange-500/20"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Email liên hệ công việc</label>
                                <Input 
                                    placeholder="vi_du@email.com" 
                                    type="email"
                                    className="h-16 rounded-2xl border-none bg-[#F1F3F5] px-6 text-sm font-medium focus-visible:ring-orange-500/20"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Lĩnh vực Chuyên môn</label>
                            <Select value={specialty} onValueChange={(details: any) => {
                                const val = typeof details === 'object' && details !== null && 'value' in details ? details.value : details;
                                setSpecialty(val);
                            }}>
                                <SelectTrigger 
                                    className="!h-16 rounded-2xl border-none bg-[#F1F3F5] px-6 text-sm font-bold text-zinc-800 focus:ring-orange-500/20"
                                    style={{ height: "4rem" }}
                                >
                                    <SelectValue placeholder="Chọn chuyên môn của bạn">
                                        {specialtyLabels[specialty]}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl bg-white p-2 z-[100] min-w-[200px]">
                                    <SelectItem value="it" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">Công nghệ thông tin</SelectItem>
                                    <SelectItem value="business" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">Kinh doanh & Quản lý</SelectItem>
                                    <SelectItem value="design" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">Nghệ thuật & Thiết kế sáng tạo</SelectItem>
                                    <SelectItem value="language" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">Ngôn ngữ học</SelectItem>
                                    <SelectItem value="science" className="cursor-pointer rounded-xl py-2.5 px-3 hover:bg-zinc-50 focus:bg-zinc-50 font-bold text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900 data-[selected]:bg-[#FF6600]/10 data-[selected]:text-[#FF6600]">Khoa học Ứng dụng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Tại sao bạn muốn giảng dạy tại Belearning?</label>
                            <Textarea 
                                placeholder="Hãy chia sẻ về tầm nhìn sư phạm và những điều làm nên phương pháp giảng dạy độc đáo của bạn..." 
                                className="min-h-[160px] rounded-2xl border-none bg-[#F1F3F5] p-6 text-sm font-medium focus-visible:ring-orange-500/20 resize-none"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-4 bg-[#F1F3F5] p-6 rounded-2xl border border-transparent hover:border-orange-200 transition-all cursor-pointer">
                            <Checkbox id="honor-code" className="w-6 h-6 rounded-lg border-zinc-300 data-[state=checked]:bg-[#FF6600] data-[state=checked]:border-none" />
                            <label htmlFor="honor-code" className="text-xs font-medium text-zinc-500 leading-relaxed cursor-pointer">
                                Tôi đồng ý với <span className="text-zinc-900 font-bold underline">Quy tắc Danh dự Giảng viên</span> và <span className="text-zinc-900 font-bold underline">Điều khoản Dịch vụ</span>.
                            </label>
                        </div>

                        <Button type="submit" className="w-64 h-16 rounded-full bg-[#FF6600] hover:bg-orange-600 transition-all font-black text-sm shadow-xl shadow-orange-500/20 text-white" disabled={isLoading}>
                            {isLoading ? "Đang gửi đơn..." : "Đăng ký làm Giảng viên"}
                        </Button>

                        <div className="pt-8 border-t border-zinc-50">
                            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest leading-relaxed">
                                Tất cả đơn đăng ký đều được xem xét kỹ lưỡng bởi Hội đồng Học thuật. Thời gian phản hồi dự kiến từ 3 đến 5 ngày làm việc.
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
      </div>
    </div>
  )
}
