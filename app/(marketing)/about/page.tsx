import Image from "next/image"
import { Star, Users, BookOpen, Award, Globe, ShieldCheck, Sparkles } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { label: "Học viên", value: "50,000+", icon: Users },
    { label: "Khóa học", value: "1,200+", icon: BookOpen },
    { label: "Giảng viên", value: "500+", icon: Star },
    { label: "Quốc gia", value: "15+", icon: Globe },
  ]

  const values = [
    {
      title: "Chất lượng hàng đầu",
      description: "Chúng tôi cam kết mang đến nội dung học thuật được kiểm duyệt kỹ lưỡng bởi các chuyên gia đầu ngành.",
      icon: Award
    },
    {
      title: "Học tập linh hoạt",
      description: "Học mọi lúc, mọi nơi trên mọi thiết bị với lộ trình được cá nhân hóa cho từng học viên.",
      icon: Globe
    },
    {
      title: "Cộng đồng hỗ trợ",
      description: "Kết nối với mạng lưới học viên và giảng viên toàn cầu để cùng nhau phát triển.",
      icon: Users
    },
    {
      title: "Bảo mật & Tin cậy",
      description: "Hệ thống thanh toán và dữ liệu của bạn luôn được bảo vệ an toàn tuyệt đối.",
      icon: ShieldCheck
    }
  ]

  return (
    <div className="bg-white pt-32 pb-24 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-100 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6600] fill-[#FF6600]" />
                <span className="text-[10px] font-black text-[#FF6600] uppercase tracking-widest text-center">Về Belearning</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-tight text-zinc-900">
                Nâng tầm tri thức <br/>
                <span className="text-[#FF6600]">Kiến tạo tương lai.</span>
            </h1>
            <p className="text-zinc-500 font-medium text-lg leading-relaxed max-w-xl">
                Belearning không chỉ là một nền tảng học trực tuyến, mà là cầu nối giúp bạn tiếp cận với những tinh hoa tri thức từ khắp nơi trên thế giới. Chúng tôi tin rằng giáo dục là chìa khóa để thay đổi cuộc đời.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
                {stats.map((stat, i) => (
                    <div key={i} className="space-y-2 border-l-4 border-orange-500 pl-6 py-2">
                        <p className="text-3xl font-black text-zinc-900">{stat.value}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</p>
                    </div>
                ))}
            </div>
          </div>
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white aspect-square bg-zinc-100">
              <Image 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" 
                alt="About Belearning" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[3rem] shadow-2xl border border-zinc-50 max-w-xs space-y-4">
                <div className="w-12 h-12 bg-[#FF6600] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <p className="font-black text-zinc-900 leading-relaxed">Hơn 10 năm kinh nghiệm trong lĩnh vực giáo dục trực tuyến.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-zinc-900 py-32 rounded-[5rem] mx-6 mb-32 overflow-hidden relative shadow-2xl shadow-zinc-900/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-10 relative z-10 text-center space-y-24">
            <div className="max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">Sứ mệnh của chúng tôi</h2>
                <p className="text-zinc-400 font-medium text-lg leading-relaxed">
                    Xóa bỏ rào cản địa lý và chi phí để mang giáo dục chất lượng cao đến với mọi người. Chúng tôi xây dựng một hệ sinh thái học tập nơi sự sáng tạo và đam mê được tôn trọng và thúc đẩy.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                {values.map((value, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[3rem] hover:bg-white/10 transition-colors group">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white group-hover:bg-[#FF6600] group-hover:text-white transition-all mb-8">
                            <value.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-4">{value.title}</h3>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed">{value.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Team Invitation */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Đội ngũ sáng lập & Cố vấn</h2>
            <p className="text-zinc-500 font-medium leading-relaxed text-lg">
                Chúng tôi quy tụ những chuyên gia, giáo sư và các nhà lãnh đạo thực tiễn từ khắp nơi trên thế giới. Mỗi thành viên tại Belearning đều mang trong mình ngọn lửa nhiệt huyết.
            </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pt-10">
            {[1,2,3,4,5,6].map(i => (
                <div key={i} className="space-y-6 group cursor-pointer">
                    <div className="relative rounded-[2.5rem] overflow-hidden aspect-square shadow-xl group-hover:scale-105 transition-transform duration-500 bg-zinc-100">
                        <Image 
                            src={`https://i.pravatar.cc/300?u=team-${i}`} 
                            alt="Team Member" 
                            fill 
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                    <div>
                        <p className="font-black text-zinc-900 text-base">Thành viên {i}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-1">Hội đồng cố vấn</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="pt-16">
            <button className="h-16 px-12 rounded-full bg-zinc-900 text-white font-black text-xs uppercase tracking-widest hover:bg-[#FF6600] transition-all shadow-xl shadow-zinc-200">
                Tìm hiểu về đội ngũ của chúng tôi
            </button>
        </div>
      </section>
    </div>
  )
}
