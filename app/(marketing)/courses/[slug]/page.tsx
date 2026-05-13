import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { 
  Badge 
} from "@/components/ui/badge"
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
  Layout
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { CourseEnrollButtons } from "@/components/ui-custom/course-enroll-buttons"
import { CourseCurriculum } from "@/components/course/course-curriculum"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { title: true, description: true, thumbnail: true }
  })

  if (!course) return { title: "Course Not Found" }

  return {
    title: `${course.title} | Vibecode Academy`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description || "",
      images: course.thumbnail ? [course.thumbnail] : []
    }
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
    : 0

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      {/* HEADER / BREADCRUMB */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 border-b">
         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/courses" className="hover:text-blue-600 transition-colors">Khóa học</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-zinc-900 dark:text-white font-medium line-clamp-1">{course.title}</span>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              <Badge className="bg-blue-600 text-white rounded-lg px-3">{course.category?.name}</Badge>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">{course.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                 <div className="flex items-center gap-1.5">
                    <div className="flex">
                       {[1,2,3,4,5].map(s => (
                          <Star key={s} className={cn("w-4 h-4", s <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-zinc-300")} />
                       ))}
                    </div>
                    <span className="font-bold">({course.reviews.length} đánh giá)</span>
                 </div>
                 <div className="flex items-center gap-1.5 font-medium">
                    <Users className="w-4 h-4 text-zinc-400" />
                    {course._count.enrollments} học viên đã tham gia
                 </div>
              </div>
              <div className="flex items-center gap-4 py-4 border-y border-zinc-100 dark:border-zinc-800">
                 <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                    <Image src={course.instructor.image || `https://i.pravatar.cc/100?u=${course.instructor.id}`} alt={course.instructor.name || ""} fill className="object-cover" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Giảng viên</span>
                    <span className="font-bold text-lg">{course.instructor.name}</span>
                 </div>
                 <div className="ml-auto flex items-center gap-6 text-sm text-zinc-500 font-medium">
                    <div className="flex items-center gap-1.5">
                       <Award className="w-4 h-4 text-blue-500" />
                       {course.level}
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Layout className="w-4 h-4 text-purple-500" />
                       Tiếng Việt
                    </div>
                 </div>
              </div>
            </div>

            <Tabs defaultValue="description" className="w-full">
               <TabsList className="w-full justify-start bg-transparent border-b rounded-none p-0 h-auto gap-8">
                  <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-4 font-bold text-lg">Mô tả</TabsTrigger>
                  <TabsTrigger value="curriculum" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-4 font-bold text-lg">Chương trình học</TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-4 font-bold text-lg">Đánh giá</TabsTrigger>
                  <TabsTrigger value="instructor" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-4 font-bold text-lg">Giảng viên</TabsTrigger>
               </TabsList>

               <TabsContent value="description" className="py-8 space-y-10">
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                     <h3 className="text-xl font-bold mb-6">Bạn sẽ học được gì?</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.whatYouWillLearn?.split(';').map((item, i) => (
                           <div key={i} className="flex gap-3 text-sm leading-relaxed">
                              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                              <span>{item}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                     <h3 className="text-xl font-bold mb-4">Chi tiết khóa học</h3>
                     <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">{course.description}</p>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold mb-4">Yêu cầu</h3>
                     <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                        {course.requirements?.split(';').map((item, i) => (
                           <li key={i}>{item}</li>
                        ))}
                     </ul>
                  </div>
               </TabsContent>

               <TabsContent value="curriculum" className="py-8">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-xl font-bold">Chương trình học</h3>
                     <span className="text-sm text-zinc-500 font-medium">
                        {course.sections.length} chương • {course.sections.reduce((acc, s) => acc + s.lessons.length, 0)} bài giảng
                     </span>
                  </div>
                  <CourseCurriculum sections={course.sections as any} />
               </TabsContent>

               <TabsContent value="reviews" className="py-8">
                   <div className="flex flex-col md:flex-row gap-12 items-center mb-12">
                      <div className="text-center space-y-2">
                         <div className="text-6xl font-black">{averageRating.toFixed(1)}</div>
                         <div className="flex justify-center">
                            {[1,2,3,4,5].map(s => <Star key={s} className={cn("w-5 h-5", s <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-zinc-300")} />)}
                         </div>
                         <div className="text-zinc-500 font-medium">Đánh giá trung bình</div>
                      </div>
                      <div className="flex-1 space-y-3 w-full">
                         {[5, 4, 3, 2, 1].map((rating) => {
                            const count = course.reviews.filter(r => r.rating === rating).length
                            const percent = course.reviews.length > 0 ? (count / course.reviews.length) * 100 : 0
                            return (
                               <div key={rating} className="flex items-center gap-4 text-sm font-medium">
                                  <div className="w-12 text-zinc-500"> {rating} sao</div>
                                  <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                     <div className="h-full bg-yellow-400" style={{ width: `${percent}%` }} />
                                  </div>
                                  <div className="w-12 text-zinc-500 text-right">{Math.round(percent)}%</div>
                               </div>
                            )
                         })}
                      </div>
                   </div>
                   <div className="space-y-8">
                      {course.reviews.map((review) => (
                         <div key={review.id} className="space-y-4">
                            <div className="flex items-center gap-3">
                               <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-100">
                                  <Image src={review.user.image || `https://i.pravatar.cc/100?u=${review.user.id}`} alt={review.user.name || ""} fill className="object-cover" />
                               </div>
                               <div>
                                  <div className="font-bold">{review.user.name}</div>
                                  <div className="flex gap-1">
                                     {[1,2,3,4,5].map(s => <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-300")} />)}
                                  </div>
                               </div>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 italic">"{review.comment}"</p>
                         </div>
                      ))}
                   </div>
               </TabsContent>

               <TabsContent value="instructor" className="py-8 space-y-6">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                     <div className="relative w-40 h-40 rounded-3xl overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shrink-0">
                        <Image src={course.instructor.image || `https://i.pravatar.cc/200?u=${course.instructor.id}`} alt={course.instructor.name || ""} fill className="object-cover" />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-2xl font-black">{course.instructor.name}</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">{course.instructor.bio}</p>
                        <div className="flex gap-6 text-sm font-bold">
                           <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-blue-500" />
                              12 Khóa học
                           </div>
                           <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              4.9 Đánh giá
                           </div>
                           <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-emerald-500" />
                              2,450 Học viên
                           </div>
                        </div>
                     </div>
                  </div>
               </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT SIDEBAR (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-zinc-950 border rounded-3xl overflow-hidden shadow-2xl shadow-zinc-200/50 dark:shadow-none">
               <div className="relative aspect-video group cursor-pointer">
                  <Image 
                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} 
                    alt={course.title} 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-blue-600 fill-current ml-1" />
                     </div>
                  </div>
                  <div className="absolute bottom-4 left-0 w-full text-center text-white font-bold text-sm">Xem trước khóa học</div>
               </div>
               
               <div className="p-8 space-y-6">
                  <div className="space-y-2">
                     <div className="text-4xl font-black text-blue-600">
                        {course.price === 0 ? "Miễn phí" : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                     </div>
                     {course.price > 0 && (
                        <div className="text-zinc-500 line-through font-bold text-lg">
                           {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price * 1.5)}
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

                  <div className="space-y-4 pt-6 border-t">
                     <p className="font-bold text-sm">Khóa học bao gồm:</p>
                     <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-3">
                           <Play className="w-4 h-4 text-zinc-400" />
                           {course.sections.reduce((acc, s) => acc + s.lessons.length, 0)} bài giảng video
                        </div>
                        <div className="flex items-center gap-3">
                           <Clock className="w-4 h-4 text-zinc-400" />
                           8 giờ nội dung chất lượng
                        </div>
                        <div className="flex items-center gap-3">
                           <Smartphone className="w-4 h-4 text-zinc-400" />
                           Học trên mọi thiết bị
                        </div>
                        <div className="flex items-center gap-3">
                           <Award className="w-4 h-4 text-zinc-400" />
                           Chứng chỉ hoàn thành
                        </div>
                        <div className="flex items-center gap-3">
                           <BookOpen className="w-4 h-4 text-zinc-400" />
                           Tài liệu hướng dẫn đi kèm
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
