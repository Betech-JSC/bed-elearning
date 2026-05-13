import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  ArrowRight, 
  Play, 
  Users, 
  Star, 
  CheckCircle,
  Layout,
  Code,
  Smartphone,
  Cloud,
  Database,
  Bot
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CourseCard } from "@/components/ui-custom/course-card"

export default async function HomePage() {
  const featuredCourses = await prisma.course.findMany({
    where: { isFeatured: true, status: "PUBLISHED" },
    include: {
      instructor: true,
      category: true,
      _count: {
        select: { enrollments: true }
      }
    },
    take: 8
  })

  const categories = await prisma.category.findMany({ take: 6 })
  
  const instructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    take: 4,
    include: {
        _count: { select: { courses: true } }
    }
  })

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1 text-sm font-medium">
                Sứ mệnh dẫn đầu kỷ nguyên AI
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1]">
                Vibe Coding <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Học một lần</span><br/>
                Code mãi mãi
            </h1>
            <p className="text-xl text-zinc-400 max-w-lg leading-relaxed">
                Đánh thức tiềm năng lập trình trong bạn với sự trợ giúp của AI. Chúng tôi không chỉ dạy code, chúng tôi dạy cách tư duy cùng trí tuệ nhân tạo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 transition-all hover:scale-105">
                <Link href="/courses">
                   Khám phá khóa học
                   <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-2xl font-bold text-lg border-zinc-800 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                <Link href="/learn/ai-coding-cursor-claude/lesson-1" className="flex items-center gap-2">
                   <Play className="w-5 h-5 fill-current" />
                   Free Preview
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-8">
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">20k+</span>
                  <span className="text-sm text-zinc-500">Học viên</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">50+</span>
                  <span className="text-sm text-zinc-500">Chuyên gia</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">4.9</span>
                  <span className="text-sm text-zinc-500 flex items-center gap-1">
                     <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> Đánh giá
                  </span>
               </div>
            </div>
          </div>
          <div className="relative animate-in fade-in zoom-in duration-1000 delay-200">
             <div className="absolute -inset-4 bg-blue-600/20 blur-3xl rounded-full opacity-50" />
             <div className="relative border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                    src="/hero_vibe_coding_1778041166767.png" 
                    alt="Vibecode AI Illustration" 
                    width={800} 
                    height={600} 
                    className="w-full h-auto object-cover"
                />
             </div>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-2">Khóa học nổi bật</h2>
              <p className="text-zinc-500">Được bình chọn và đánh giá cao nhất bởi cộng đồng Vibecode.</p>
            </div>
            <Link href="/courses" className="text-blue-600 font-bold hover:underline flex items-center gap-1 group">
               Xem tất cả
               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <h2 className="text-4xl font-black tracking-tight mb-4">Khám phá theo danh mục</h2>
           <p className="text-zinc-500 mb-16 max-w-2xl mx-auto">Mọi kỹ năng bạn cần để làm chủ thị trường công nghệ hiện nay.</p>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((cat) => {
                 const Icon = cat.icon === "bot" ? Bot : cat.icon === "code" ? Code : cat.icon === "smartphone" ? Smartphone : cat.icon === "cloud" ? Cloud : cat.icon === "database" ? Database : Layout
                 return (
                    <Link key={cat.id} href={`/courses?category=${cat.slug}`} className="group p-8 bg-white dark:bg-zinc-950 rounded-3xl border hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all">
                       <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8 text-blue-600" />
                       </div>
                       <h3 className="font-bold text-sm">{cat.name}</h3>
                    </Link>
                 )
              })}
           </div>
        </div>
      </section>

      {/* INSTRUCTORS */}
      <section className="py-24 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tight mb-4">Học từ chuyên gia</h2>
              <p className="text-zinc-500 max-w-2xl mx-auto">Đội ngũ giảng viên là những kỹ sư hàng đầu từ các tập đoàn công nghệ lớn.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {instructors.map((instructor) => (
                 <div key={instructor.id} className="text-center group">
                    <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-zinc-50 dark:border-zinc-800 shadow-xl group-hover:border-blue-500 transition-all">
                       <Image 
                          src={instructor.image || `https://i.pravatar.cc/200?u=${instructor.id}`} 
                          alt={instructor.name || ""} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                       />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{instructor.name}</h3>
                    <p className="text-zinc-500 text-sm mb-4">{instructor._count.courses} khóa học</p>
                    <div className="flex justify-center gap-4">
                       <Link href="#" className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
                          <Layout className="w-4 h-4" />
                       </Link>
                       <Link href="#" className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
                          <Code className="w-4 h-4" />
                       </Link>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white dark:from-zinc-950 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tight mb-4">Học viên nói gì</h2>
              <p className="text-blue-100">Hàng ngàn câu chuyện thành công bắt đầu từ Vibecode.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                 <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 space-y-6">
                    <div className="flex gap-1">
                       {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="italic leading-relaxed">
                       "Khóa học thật sự thay đổi cách tôi làm việc. Trước đây tôi mất cả ngày để viết một tính năng, giờ đây với AI, tôi hoàn thành nó trong chưa đầy 1 giờ."
                    </p>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-blue-400" />
                       <div>
                          <p className="font-bold">Nguyễn Văn {i}</p>
                          <p className="text-xs text-blue-200">Software Engineer</p>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="py-24 bg-zinc-950 text-white border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
           <h2 className="text-5xl md:text-6xl font-black tracking-tight">Sẵn sàng bắt đầu?</h2>
           <p className="text-xl text-zinc-400">Tham gia cùng 20,000+ học viên khác ngay hôm nay và nhận ưu đãi 30% cho khóa học đầu tiên.</p>
           <Button asChild size="lg" className="bg-white text-black hover:bg-zinc-200 h-16 px-12 rounded-2xl font-black text-xl shadow-2xl shadow-white/5">
              <Link href="/register">Đăng ký ngay</Link>
           </Button>
        </div>
      </section>
    </div>
  )
}
