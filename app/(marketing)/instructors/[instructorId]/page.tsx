import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Star, Users, BookOpen, Award, Globe, Sparkles, Medal } from "lucide-react"
import { Github, Linkedin, Twitter, Youtube } from "@/components/shared/social-icons"
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

  const hasSocials = instructor.websiteUrl || instructor.githubUrl || instructor.linkedinUrl || instructor.twitterUrl || instructor.youtubeUrl

  return (
    <div className="bg-[#F8F9FA] pb-24 min-h-screen">
      {/* 1. PROFILE COVER BANNER */}
      <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-orange-950">
        {instructor.coverImage ? (
          <Image 
            src={instructor.coverImage} 
            alt={`${instructor.name} Cover`} 
            fill 
            className="object-cover opacity-60" 
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-zinc-950/40 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-36 relative z-10">
        {/* Profile Hero & Sidebar Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          
          {/* SIDEBAR: Personal Information Card */}
          <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
             <div className="bg-white rounded-[3.5rem] p-10 border border-zinc-100 shadow-xl shadow-zinc-200/40 flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -z-10" />
                
                {/* Avatar with dynamic border glow */}
                <div className="relative w-44 h-44 rounded-[3.2rem] overflow-hidden shadow-2xl border-4 border-white mb-8 group-hover:scale-105 transition-transform duration-500 bg-zinc-100">
                    <Image 
                      src={instructor.image || `https://i.pravatar.cc/150?u=${instructor.id}`} 
                      alt={instructor.name || "Instructor"} 
                      fill 
                      className="object-cover"
                      sizes="176px"
                    />
                </div>

                {/* Verification Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full mb-4">
                  <Medal className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Giảng viên uy tín</span>
                </div>

                <h1 className="text-3xl font-black text-zinc-900 mb-2">{instructor.name}</h1>
                <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-8 max-w-xs">{instructor.bio || "Chuyên gia đào tạo Belearning"}</p>
                
                {/* Dynamic Social Network Links */}
                {hasSocials && (
                  <div className="flex flex-wrap justify-center gap-3.5 mb-10">
                      {instructor.websiteUrl && (
                        <a href={instructor.websiteUrl} target="_blank" rel="noopener noreferrer" title="Website cá nhân"
                           className="w-11 h-11 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#FF6600] transition-all duration-300 hover:scale-110 shadow-sm">
                            <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {instructor.githubUrl && (
                        <a href={instructor.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub profile"
                           className="w-11 h-11 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300 hover:scale-110 shadow-sm">
                            <Github className="w-4 h-4" />
                        </a>
                      )}
                      {instructor.linkedinUrl && (
                        <a href={instructor.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn profile"
                           className="w-11 h-11 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-blue-600 transition-all duration-300 hover:scale-110 shadow-sm">
                            <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {instructor.twitterUrl && (
                        <a href={instructor.twitterUrl} target="_blank" rel="noopener noreferrer" title="Twitter / X profile"
                           className="w-11 h-11 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-950 transition-all duration-300 hover:scale-110 shadow-sm">
                            <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {instructor.youtubeUrl && (
                        <a href={instructor.youtubeUrl} target="_blank" rel="noopener noreferrer" title="Kênh YouTube"
                           className="w-11 h-11 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-sm">
                            <Youtube className="w-4 h-4" />
                        </a>
                      )}
                  </div>
                )}

                {/* Quick stats grid */}
                <div className="w-full grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-zinc-50 p-6 rounded-3xl text-center space-y-1">
                        <p className="text-2xl font-black text-zinc-900">{instructor.totalStudents}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Học viên</p>
                    </div>
                    <div className="bg-zinc-50 p-6 rounded-3xl text-center space-y-1">
                        <p className="text-2xl font-black text-zinc-900">{instructor.totalReviews}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Đánh giá</p>
                    </div>
                </div>
                
                <MessageButton 
                    instructorId={instructor.id}
                    instructorName={instructor.name || "Giảng viên"}
                    instructorImage={instructor.image || undefined}
                />
             </div>
          </div>

          {/* MAIN PORTFOLIO CONTENT: Dynamic Custom Decorated Portfolio */}
          <div className="lg:col-span-2 space-y-12 animate-in fade-in slide-in-from-right-8 duration-1000">
             
             {/* Dynamic Rich-Text Portfolio decoration */}
             {instructor.portfolioContent ? (
               <div className="space-y-6">
                 <h2 className="text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
                   <Sparkles className="w-6 h-6 text-[#FF6600] animate-pulse" />
                   Hồ sơ Năng lực chuyên môn (Portfolio)
                 </h2>
                 <div className="bg-white rounded-[3.5rem] p-10 md:p-12 border border-zinc-100 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-2 h-full bg-[#FF6600]" />
                   <div className="prose prose-orange max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                     <div 
                       dangerouslySetInnerHTML={{ __html: instructor.portfolioContent }} 
                       className="space-y-4"
                     />
                   </div>
                 </div>
               </div>
             ) : (
               /* Default Fallback About Section */
               <div className="space-y-6">
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Giới thiệu giảng viên</h2>
                  <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 leading-relaxed text-zinc-600 font-medium shadow-sm">
                     <p className="mb-4">
                        {instructor.bio || "Giảng viên chưa cập nhật phần giới thiệu chi tiết."}
                     </p>
                     <p>
                        Với kinh nghiệm thực tế chuyên sâu và tinh thần tận tâm truyền nghề, {instructor.name} đã dẫn dắt hàng ngàn học viên làm chủ kiến thức từ cơ bản tới nâng cao, tạo bước đột phá vững chắc cho sự nghiệp cá nhân. Belearning tự hào là đối tác đào tạo tin cậy cùng chuyên gia.
                     </p>
                  </div>
               </div>
             )}

             {/* Dynamic badges row */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] flex items-center gap-6 border border-zinc-100 shadow-sm">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6600] flex-shrink-0">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-zinc-900">{instructor.totalCourses}</p>
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Khóa học đang dạy</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] flex items-center gap-6 border border-zinc-100 shadow-sm">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 flex-shrink-0">
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

        {/* 3. INSTRUCTOR'S PUBLISHED COURSES */}
        <div className="space-y-10 pt-8 border-t border-zinc-100">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Các khóa học đang tuyển sinh</h2>
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
                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-zinc-100 shadow-sm">
                        <p className="text-zinc-500 font-medium">Hiện tại giảng viên chưa xuất bản khóa học nào.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  )
}
