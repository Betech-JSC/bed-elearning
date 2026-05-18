import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Star, Users, BookOpen, Award, Globe } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { CourseCard } from "@/components/ui-custom/course-card"
import { MessageButton } from "@/components/instructor/message-button"

interface InstructorPageProps {
  params: Promise<{ instructorId: string }>
}

async function getInstructorData(instructorId: string) {
  const instructor = await prisma.user.findUnique({
    where: {
      id: instructorId,
      role: "INSTRUCTOR"
    },
    include: {
      courses: {
        where: {
          status: "PUBLISHED"
        },
        include: {
          category: true,
          reviews: true,
          enrollments: true
        }
      },
      reviews: true
    }
  })

  if (!instructor) return null

  const totalCourses = instructor.courses.length
  const totalStudents = instructor.courses.reduce((acc, course) => acc + course.enrollments.length, 0)
  const totalReviews = instructor.courses.reduce((acc, course) => acc + course.reviews.length, 0)
  
  const allRatings = instructor.courses.flatMap(c => c.reviews.map(r => r.rating))
  const averageRating = allRatings.length > 0 
    ? allRatings.reduce((acc, curr) => acc + curr, 0) / allRatings.length 
    : 5.0

  return {
    ...instructor,
    totalCourses,
    totalStudents,
    totalReviews,
    averageRating: averageRating.toFixed(1)
  }
}

export default async function InstructorDetailPage({ params }: InstructorPageProps) {
  const { instructorId } = await params
  const instructor = await getInstructorData(instructorId)

  if (!instructor) {
    notFound()
  }

  return (
    <div className="bg-[#F8F9FA] pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Profile Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
             <div className="bg-white rounded-[3.5rem] p-10 border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col items-center text-center">
                <div className="relative w-40 h-40 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white mb-8">
                    <Image 
                        src={instructor.image || `https://i.pravatar.cc/150?u=${instructor.id}`} 
                        alt={instructor.name || "Instructor"} 
                        fill 
                        className="object-cover"
                    />
                </div>
                <h1 className="text-3xl font-black text-zinc-900 mb-2">{instructor.name}</h1>
                <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest mb-8">{instructor.bio || "Giảng viên Belearning"}</p>
                
                <div className="flex gap-4 mb-10">
                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 hover:text-[#FF6600] hover:bg-orange-50 transition-all cursor-pointer">
                        <Globe className="w-4 h-4" />
                    </div>
                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 hover:text-[#FF6600] hover:bg-orange-50 transition-all cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    </div>
                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 hover:text-[#FF6600] hover:bg-orange-50 transition-all cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </div>
                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 hover:text-[#FF6600] hover:bg-orange-50 transition-all cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-4">
                    <div className="bg-zinc-50 p-6 rounded-3xl text-center space-y-1">
                        <p className="text-2xl font-black text-zinc-900">{instructor.totalStudents}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Học viên</p>
                    </div>
                    <div className="bg-zinc-50 p-6 rounded-3xl text-center space-y-1">
                        <p className="text-2xl font-black text-zinc-900">{instructor.totalReviews}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Đánh giá</p>
                    </div>
                </div>
                
                <MessageButton 
                    instructorId={instructor.id}
                    instructorName={instructor.name || "Giảng viên"}
                    instructorImage={instructor.image || undefined}
                />
             </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12 animate-in fade-in slide-in-from-right-8 duration-1000">
             <div className="space-y-6">
                <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Về giảng viên</h2>
                <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 leading-relaxed text-zinc-600 font-medium shadow-sm">
                   <p className="mb-4">
                      {instructor.bio || "Giảng viên này chưa cập nhật thông tin giới thiệu chi tiết."}
                   </p>
                   <p>
                      Với kinh nghiệm thực chiến dày dặn, {instructor.name} đã giúp hàng ngàn học viên nắm vững các kỹ năng và thay đổi sự nghiệp. Belearning tự hào có sự đồng hành của một chuyên gia tâm huyết như vậy.
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] flex items-center gap-6 border border-zinc-100">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6600]">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900">{instructor.totalCourses}</p>
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Khóa học giảng dạy</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] flex items-center gap-6 border border-zinc-100">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900">{instructor.averageRating}</p>
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Xếp hạng trung bình</p>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* Instructor Courses */}
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Khóa học đang giảng dạy</h2>
                <Link href="/courses" className="text-sm font-black text-[#FF6600] hover:underline flex items-center gap-2">
                    Xem tất cả
                    <BookOpen className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {instructor.courses.map((course) => (
                    <CourseCard 
                        key={course.id} 
                        course={{
                            ...course,
                            instructor: { name: instructor.name }
                        }} 
                        rating={course.reviews.length > 0 ? (course.reviews.reduce((a, b) => a + b.rating, 0) / course.reviews.length) : 5.0}
                        totalStudents={course.enrollments.length}
                    />
                ))}
                {instructor.courses.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-zinc-100">
                        <p className="text-zinc-500 font-medium">Hiện chưa có khóa học nào được xuất bản.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  )
}
