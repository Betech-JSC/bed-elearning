import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle, 
  Users, 
  Star, 
  Clock, 
  BookOpen, 
  Play, 
  Award,
  ChevronRight,
  ShoppingCart,
  Lock,
  Smartphone,
  Layout,
  Share2,
  Heart,
  Globe
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { CourseEnrollButtons } from "@/components/ui-custom/course-enroll-buttons"
import { CourseCurriculum } from "@/components/course/course-curriculum"
import { CourseSidebarActions } from "@/components/course/course-sidebar-actions"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { title: true, description: true, thumbnail: true }
  })

  if (!course) return { title: "Không tìm thấy khóa học" }

  return {
    title: `${course.title} | Belearning`,
    description: course.description,
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()
  const user = session?.user

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: true,
      category: true,
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } }
        }
      },
      reviews: {
        include: { user: true }
      },
      _count: {
        select: { enrollments: true }
      }
    }
  })

  if (!course) return notFound()

  const isEnrolled = user?.id ? await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id
      }
    }
  }) : null

  const averageRating = course.reviews.length > 0 
    ? course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length 
    : 5.0

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* HEADER SECTION */}
      <div className="bg-[#F8F9FA] border-b border-zinc-100">
         <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
            <Link href="/" className="hover:text-[#FF6600] transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/courses" className="hover:text-[#FF6600] transition-colors">Khóa học</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-900 line-clamp-1">{course.title}</span>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <Badge className="bg-orange-100 text-[#FF6600] border-none rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">{course.category?.name}</Badge>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.1] text-zinc-900">{course.title}</h1>
              
              <div className="flex flex-wrap items-center gap-8 text-sm">
                 <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-xl">
                        <Star className="w-4 h-4 fill-[#FF6600] text-[#FF6600]" />
                        <span className="font-black text-[#FF6600] text-lg">{averageRating.toFixed(1)}</span>
                    </div>
                    <span className="font-bold text-zinc-400">({course.reviews.length} đánh giá)</span>
                 </div>
                 <div className="flex items-center gap-3 font-black text-zinc-400 uppercase tracking-widest text-[10px]">
                    <Users className="w-4 h-4" />
                    {course._count.enrollments} học viên tham gia
                 </div>
              </div>

              <div className="flex items-center gap-6 py-8 border-y border-zinc-100">
                 <Link href={`/instructors/${course.instructor.id}`} className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-xl hover:scale-105 transition-transform">
                    <Image 
                        src={course.instructor.image || "/hero_vibe_coding_1778041166767.png"} 
                        alt={course.instructor.name || ""} 
                        fill 
                        className="object-cover" 
                    />
                 </Link>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 uppercase font-black tracking-[0.2em] mb-1">Giảng viên chuyên môn</span>
                    <Link href={`/instructors/${course.instructor.id}`} className="font-black text-2xl text-zinc-900 hover:text-[#FF6600] transition-colors">{course.instructor.name}</Link>
                 </div>
                 <div className="ml-auto hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                       <Award className="w-5 h-5 text-[#FF6600]" />
                       {course.level}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                       <Globe className="w-5 h-5 text-emerald-500" />
                       Tiếng Việt
                    </div>
                 </div>
              </div>
            </div>

            <Tabs defaultValue="description" className="w-full">
               <TabsList className="w-full justify-start bg-transparent border-b border-zinc-100 rounded-none p-0 h-auto gap-12">
                  <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF6600] data-[state=active]:bg-transparent px-0 py-6 font-black text-xs uppercase tracking-widest text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Nội dung</TabsTrigger>
                  <TabsTrigger value="curriculum" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF6600] data-[state=active]:bg-transparent px-0 py-6 font-black text-xs uppercase tracking-widest text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Lộ trình</TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF6600] data-[state=active]:bg-transparent px-0 py-6 font-black text-xs uppercase tracking-widest text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Đánh giá</TabsTrigger>
                  <TabsTrigger value="instructor" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF6600] data-[state=active]:bg-transparent px-0 py-6 font-black text-xs uppercase tracking-widest text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Tác giả</TabsTrigger>
               </TabsList>

               <TabsContent value="description" className="py-12 space-y-12">
                  <div className="bg-[#F1F3F5] p-10 rounded-[3rem] border border-zinc-100">
                     <h3 className="text-2xl font-black text-zinc-900 mb-8 tracking-tight">Mục tiêu khóa học</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {course.whatYouWillLearn?.split(';').map((item, i) => (
                           <div key={i} className="flex gap-4 text-sm font-medium text-zinc-600 leading-relaxed">
                              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                              <span>{item}</span>
                           </div>
                        ))}
                        {!course.whatYouWillLearn && (
                             <p className="text-zinc-400 italic">Dữ liệu mục tiêu đang được cập nhật...</p>
                        )}
                     </div>
                  </div>
                  
                  <div className="space-y-6">
                     <h3 className="text-3xl font-black text-zinc-900 tracking-tight">Chi tiết về khóa học</h3>
                     <p className="text-zinc-600 font-medium leading-relaxed whitespace-pre-line text-lg">{course.description}</p>
                  </div>

                  {course.requirements && (
                    <div className="bg-orange-50/30 p-10 rounded-[3rem] border border-orange-100/50">
                        <h3 className="text-2xl font-black text-zinc-900 mb-6 tracking-tight">Yêu cầu tham gia</h3>
                        <ul className="space-y-4">
                            {course.requirements.split(';').map((item, i) => (
                            <li key={i} className="flex items-center gap-4 text-zinc-600 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6600]" />
                                {item}
                            </li>
                            ))}
                        </ul>
                    </div>
                  )}
               </TabsContent>

               <TabsContent value="curriculum" className="py-12">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-3xl font-black text-zinc-900 tracking-tight">Chương trình đào tạo</h3>
                     <div className="bg-zinc-50 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        {course.sections.length} chương • {course.sections.reduce((acc, s) => acc + s.lessons.length, 0)} bài học
                     </div>
                  </div>
                  <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
                    <CourseCurriculum sections={course.sections as any} />
                  </div>
               </TabsContent>

               <TabsContent value="reviews" className="py-12">
                    <div className="flex flex-col md:flex-row gap-16 items-center mb-16 bg-[#F8F9FA] p-12 rounded-[4rem]">
                       <div className="text-center space-y-4">
                          <div className="text-8xl font-black text-zinc-900 leading-none">{averageRating.toFixed(1)}</div>
                          <div className="flex justify-center gap-1">
                             {[1,2,3,4,5].map(s => <Star key={s} className={cn("w-6 h-6", s <= Math.round(averageRating) ? "fill-[#FF6600] text-[#FF6600]" : "text-zinc-200")} />)}
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Đánh giá trung bình</p>
                       </div>
                       <div className="flex-1 space-y-4 w-full">
                          {[5, 4, 3, 2, 1].map((rating) => {
                             const count = course.reviews.filter(r => r.rating === rating).length
                             const percent = course.reviews.length > 0 ? (count / course.reviews.length) * 100 : 0
                             return (
                                <div key={rating} className="flex items-center gap-6 text-xs font-black uppercase tracking-widest">
                                   <div className="w-14 text-zinc-400"> {rating} sao</div>
                                   <div className="flex-1 h-3 bg-white rounded-full overflow-hidden shadow-inner">
                                      <div className="h-full bg-[#FF6600] rounded-full" style={{ width: `${percent}%` }} />
                                   </div>
                                   <div className="w-12 text-zinc-900 text-right">{Math.round(percent)}%</div>
                                </div>
                             )
                          })}
                       </div>
                    </div>
                    
                    <div className="space-y-10">
                       {course.reviews.map((review) => (
                          <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm space-y-6">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-zinc-100 shadow-lg">
                                        <Image src={review.user.image || "/hero_vibe_coding_1778041166767.png"} alt={review.user.name || ""} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <div className="font-black text-zinc-900">{review.user.name}</div>
                                        <div className="flex gap-1 mt-1">
                                            {[1,2,3,4,5].map(s => <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "fill-[#FF6600] text-[#FF6600]" : "text-zinc-200")} />)}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                </div>
                             </div>
                             <p className="text-zinc-600 font-medium leading-relaxed italic text-lg">"{review.comment}"</p>
                          </div>
                       ))}
                       {course.reviews.length === 0 && (
                            <div className="text-center py-20 text-zinc-400 font-medium italic">Chưa có đánh giá nào cho khóa học này.</div>
                       )}
                    </div>
               </TabsContent>

               <TabsContent value="instructor" className="py-12 space-y-10">
                  <div className="flex flex-col md:flex-row gap-12 items-start bg-white p-12 rounded-[4rem] border border-zinc-100 shadow-xl shadow-zinc-200/50">
                     <Link href={`/instructors/${course.instructor.id}`} className="relative w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl shrink-0 hover:scale-105 transition-transform duration-500">
                        <Image src={course.instructor.image || "/hero_vibe_coding_1778041166767.png"} alt={course.instructor.name || ""} fill className="object-cover" />
                     </Link>
                     <div className="space-y-6">
                        <div>
                            <span className="text-[10px] text-zinc-400 uppercase font-black tracking-[0.2em] mb-2 block">Giới thiệu tác giả</span>
                            <Link href={`/instructors/${course.instructor.id}`} className="text-4xl font-black text-zinc-900 hover:text-[#FF6600] transition-colors">{course.instructor.name}</Link>
                        </div>
                        <p className="text-zinc-600 font-medium leading-relaxed text-lg whitespace-pre-line">{course.instructor.bio || "Chuyên gia đào tạo tâm huyết tại hệ thống Belearning."}</p>
                        <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-widest pt-4 border-t border-zinc-50">
                           <div className="flex items-center gap-3 text-zinc-400">
                              <BookOpen className="w-5 h-5 text-[#FF6600]" />
                              <span className="text-zinc-900">12+ Khóa học</span>
                           </div>
                           <div className="flex items-center gap-3 text-zinc-400">
                              <Star className="w-5 h-5 text-[#FF6600]" />
                              <span className="text-zinc-900">4.9/5 Rating</span>
                           </div>
                           <div className="flex items-center gap-3 text-zinc-400">
                              <Users className="w-5 h-5 text-[#FF6600]" />
                              <span className="text-zinc-900">2.5k+ Học viên</span>
                           </div>
                        </div>
                        <Button asChild variant="outline" className="h-14 px-8 rounded-2xl border-zinc-200 font-black text-[10px] uppercase tracking-widest hover:bg-zinc-50 border-none bg-zinc-50">
                            <Link href={`/instructors/${course.instructor.id}`}>Xem hồ sơ chuyên gia</Link>
                        </Button>
                     </div>
                  </div>
               </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT SIDEBAR (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white border border-zinc-100 rounded-[3.5rem] overflow-hidden shadow-2xl shadow-zinc-200/50 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
               <div className="relative aspect-video group cursor-pointer overflow-hidden">
                  <Image 
                    src={course.thumbnail || "/hero_vibe_coding_1778041166767.png"} 
                    alt={course.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all">
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 text-[#FF6600] fill-current ml-1" />
                     </div>
                  </div>
                  <div className="absolute bottom-6 left-0 w-full text-center text-white font-black text-xs uppercase tracking-widest opacity-80">Xem thử khóa học</div>
               </div>
               
               <div className="p-10 space-y-10">
                  <div className="space-y-2">
                     <div className="text-5xl font-black text-zinc-900 tracking-tighter">
                        {course.price === 0 ? "Miễn phí" : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                     </div>
                     {course.price > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="text-zinc-400 line-through font-bold text-xl">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price * 1.4)}
                            </span>
                            <Badge className="bg-emerald-500 text-white border-none rounded-lg font-black text-[10px]">-30% OFF</Badge>
                        </div>
                     )}
                  </div>

                  <CourseEnrollButtons
                    course={{
                      id: course.id,
                      title: course.title,
                      price: course.price,
                      thumbnail: course.thumbnail,
                      slug: course.slug,
                      instructor: { name: course.instructor.name }
                    }}
                    isEnrolled={!!isEnrolled}
                  />

                  <CourseSidebarActions 
                    courseId={course.id}
                    courseTitle={course.title}
                  />

                  <div className="space-y-6 pt-10 border-t border-zinc-100">
                     <p className="font-black text-xs uppercase tracking-widest text-zinc-900">Thông tin bổ sung:</p>
                     <div className="space-y-4 text-sm font-medium text-zinc-500">
                        <div className="flex items-center gap-4">
                           <Play className="w-4 h-4 text-[#FF6600]" />
                           <span>Truy cập trọn đời tất cả video</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <Clock className="w-4 h-4 text-[#FF6600]" />
                           <span>Tự do học tập theo thời gian biểu</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <Smartphone className="w-4 h-4 text-[#FF6600]" />
                           <span>Tương thích mọi thiết bị di động</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <Award className="w-4 h-4 text-[#FF6600]" />
                           <span>Chứng chỉ tốt nghiệp uy tín</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <BookOpen className="w-4 h-4 text-[#FF6600]" />
                           <span>Bài tập thực hành sau mỗi chương</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
