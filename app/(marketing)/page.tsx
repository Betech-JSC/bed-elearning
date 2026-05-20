import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Play, 
  Star, 
  CheckCircle,
  Layout,
  Code,
  Smartphone,
  Cloud,
  Database,
  Bot,
  Sparkles,
  Zap,
  Award,
  Globe,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { CourseCard } from "@/components/ui-custom/course-card"

function formatStat(n: number): string {
  if (n >= 1000) return `${Math.floor(n / 1000)}K+`
  if (n > 0) return `${n}+`
  return "0"
}

export default async function HomePage() {
  const [featuredCourses, enrollmentCount, courseCount, instructorCount, globalSettings] = await Promise.all([
    prisma.course.findMany({
      where: { isFeatured: true, status: "PUBLISHED" },
      include: {
        instructor: true,
        category: true,
        reviews: true,
        _count: {
          select: { enrollments: true }
        }
      },
      take: 8
    }),
    prisma.enrollment.count(),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count({ where: { role: "INSTRUCTOR" } }),
    prisma.globalSettings.findUnique({ where: { id: "global" } })
  ])

  const studentLabel = formatStat(enrollmentCount)
  const courseLabel = formatStat(courseCount)
  const instructorLabel = formatStat(instructorCount)

  const heroImageSrc = globalSettings?.bannerImage || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80"

  return (
    <div className="flex flex-col bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-white">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2 opacity-40" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-50 border border-orange-100 rounded-2xl shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#FF6600]" />
                  <span className="text-[11px] font-black text-[#FF6600] uppercase tracking-[0.2em]">Nền tảng học tập thế hệ mới</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.95] text-zinc-900">
                  Khai phá <br/>
                  <span className="text-[#FF6600]">Tiềm năng</span> <br/>
                  vô hạn.
              </h1>
            </div>
            <p className="text-xl text-zinc-500 max-w-lg leading-relaxed font-medium">
                Tiếp cận giáo dục đẳng cấp thế giới từ bất cứ đâu. Học cùng chuyên gia, thực hành thực tế và làm chủ tương lai của chính bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-2">
              <Button asChild size="lg" className="bg-[#FF6600] hover:bg-orange-600 h-18 px-12 rounded-[2rem] font-black text-lg shadow-2xl shadow-orange-500/20 transition-all hover:scale-105 text-white border-none">
                <Link href="/courses" className="flex items-center gap-3">
                    Khám phá ngay
                    <Zap className="w-5 h-5 fill-current" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-18 px-12 rounded-[2rem] font-black text-lg border-zinc-200 bg-white hover:bg-zinc-50 transition-all text-zinc-900">
                <Link href="/about">Về chúng tôi</Link>
              </Button>
            </div>
            
            {/* Real stats row */}
            <div className="flex items-center gap-10 pt-6 border-t border-zinc-50">
                <div className="flex gap-8">
                    <div className="text-center">
                         <p className="text-2xl font-black text-zinc-900">{studentLabel}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Học viên</p>
                    </div>
                    <div className="w-px bg-zinc-100" />
                    <div className="text-center">
                        <p className="text-2xl font-black text-[#FF6600]">{courseLabel}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Khóa học</p>
                    </div>
                    <div className="w-px bg-zinc-100" />
                    <div className="text-center">
                        <p className="text-2xl font-black text-zinc-900">{instructorLabel}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Giảng viên</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-200">
             <div className="relative rounded-[4rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white group">
                <Image 
                    src={heroImageSrc} 
                    alt="Belearning Hero" 
                    width={800} 
                    height={800} 
                    className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-1000"
                />
             </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP - dùng cùng data với hero */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="bg-[#F8F9FA] rounded-[3.5rem] p-12 grid grid-cols-2 md:grid-cols-4 gap-12 border border-zinc-100">
                <div className="text-center space-y-2">
                    <p className="text-5xl font-black text-zinc-900 tracking-tighter">{studentLabel}</p>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Học viên</p>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-5xl font-black text-[#FF6600] tracking-tighter">{courseLabel}</p>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Khóa học</p>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-5xl font-black text-zinc-900 tracking-tighter">{instructorLabel}</p>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Giảng viên</p>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-5xl font-black text-[#FF6600] tracking-tighter">4.9</p>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Đánh giá sao</p>
                </div>
            </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
                <h2 className="text-5xl font-black tracking-tight text-zinc-900">Lĩnh vực hàng đầu</h2>
                <p className="text-zinc-500 font-medium text-lg leading-relaxed">
                    Khám phá các khóa học được thiết kế chuyên sâu theo từng lĩnh vực đang dẫn đầu xu hướng hiện nay.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[
                    { name: "Lập trình", icon: Code, count: "450+", color: "bg-blue-50 text-blue-600" },
                    { name: "Thiết kế", icon: Layout, count: "280+", color: "bg-purple-50 text-purple-600" },
                    { name: "Marketing", icon: Sparkles, count: "120+", color: "bg-orange-50 text-orange-600" },
                    { name: "Kinh doanh", icon: Globe, count: "90+", color: "bg-emerald-50 text-emerald-600" },
                    { name: "Data Science", icon: Database, count: "65+", color: "bg-cyan-50 text-cyan-600" },
                    { name: "AI & ML", icon: Bot, count: "45+", color: "bg-zinc-900 text-white" },
                    { name: "Di động", icon: Smartphone, count: "110+", color: "bg-red-50 text-red-600" },
                    { name: "Cloud", icon: Cloud, count: "30+", color: "bg-sky-50 text-sky-600" },
                ].map((cat, i) => (
                    <div key={i} className="group bg-white p-10 rounded-[3rem] border border-zinc-100 hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-2 transition-all duration-500 text-center space-y-6">
                        <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform", cat.color)}>
                            <cat.icon className="w-10 h-10" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-zinc-900 mb-1">{cat.name}</h4>
                            <p className="text-xs font-bold text-zinc-400">{cat.count} Khóa học</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="py-32 bg-[#F8F9FA] rounded-[5rem] mx-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-20 gap-8">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-900 leading-tight">Khóa học <span className="text-[#FF6600]">Nổi bật nhất.</span></h2>
              <p className="text-zinc-500 font-medium text-lg max-w-xl">Học từ những chuyên gia hàng đầu và những giáo trình được kiểm duyệt nghiêm ngặt.</p>
            </div>
            <Link href="/courses" className="h-16 px-10 rounded-full bg-white border border-zinc-100 text-[#FF6600] font-black text-sm flex items-center gap-3 group hover:bg-zinc-900 hover:text-white transition-all shadow-xl shadow-zinc-200/50">
               Xem tất cả khóa học
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {featuredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  rating={course.reviews.length > 0 ? (course.reviews.reduce((a, b) => a + b.rating, 0) / course.reviews.length) : 0}
                  totalStudents={course._count.enrollments}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-zinc-400">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="font-medium">Các khóa học nổi bật sẽ sớm xuất hiện tại đây.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto bg-zinc-900 rounded-[4rem] p-24 text-center text-white relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
           
           <div className="relative z-10 space-y-12 max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">Sẵn sàng bắt đầu hành trình của bạn?</h2>
              <p className="text-zinc-400 text-xl font-medium leading-relaxed">
                 Tham gia cùng hàng nghìn học viên và khám phá các khóa học từ chuyên gia hàng đầu. Học bất cứ lúc nào, bất cứ đâu.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                <Button asChild size="lg" className="bg-[#FF6600] text-white hover:bg-orange-600 h-18 px-12 rounded-[2rem] font-black text-lg shadow-2xl shadow-orange-500/30 transition-all border-none">
                  <Link href="/courses">Khám phá khóa học ngay</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-18 px-12 rounded-[2rem] font-black text-lg border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all text-white">
                  <Link href="/about">Tìm hiểu thêm</Link>
                </Button>
              </div>
           </div>
        </div>
      </section>
    </div>
  )
}

