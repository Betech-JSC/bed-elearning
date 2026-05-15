import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { BookOpen, GraduationCap, Clock, Award, ChevronRight, PlayCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatPrice } from "@/lib/utils"

export default async function StudentDashboardPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return redirect("/login")
  }

  // Fetch all enrollments
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          sections: {
            include: {
              lessons: { select: { id: true } }
            }
          }
        }
      }
    },
    orderBy: { updatedAt: "desc" }
  })

  const totalCourses = enrollments.length
  const completedCourses = enrollments.filter(e => e.isCompleted).length
  const inProgressCourses = enrollments.filter(e => !e.isCompleted && e.progress > 0).length
  
  // Get certificates
  const certificates = await prisma.certificate.count({
    where: { userId }
  })

  // Continue Learning (Last updated enrollment that is not completed)
  const continueLearning = enrollments.find(e => !e.isCompleted) || enrollments[0]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-zinc-900 dark:text-white">
          Chào mừng trở lại, <span className="text-blue-600">{session?.user?.name}</span> 👋
        </h1>
        <p className="text-zinc-500">Hôm nay bạn muốn học thêm điều gì mới?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border shadow-sm flex items-center gap-4 group hover:border-blue-500 transition-all">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Đang học</p>
            <p className="text-2xl font-black">{totalCourses}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border shadow-sm flex items-center gap-4 group hover:border-emerald-500 transition-all">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Hoàn thành</p>
            <p className="text-2xl font-black">{completedCourses}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border shadow-sm flex items-center gap-4 group hover:border-amber-500 transition-all">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Tiến độ TB</p>
            <p className="text-2xl font-black">
              {totalCourses > 0 
                ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / totalCourses) 
                : 0}%
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border shadow-sm flex items-center gap-4 group hover:border-indigo-500 transition-all">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Chứng chỉ</p>
            <p className="text-2xl font-black">{certificates}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Continue Learning */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Tiếp tục học</h2>
              <Link href="/my-courses" className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {continueLearning ? (
              <div className="bg-white dark:bg-zinc-950 border rounded-[2.5rem] p-8 shadow-sm group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-bl-full -z-0" />
                
                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                  <div className="w-full md:w-48 h-32 bg-zinc-100 dark:bg-zinc-900 rounded-3xl overflow-hidden shrink-0 shadow-sm border">
                    {continueLearning.course.thumbnail ? (
                      <img 
                        src={continueLearning.course.thumbnail} 
                        alt={continueLearning.course.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <BookOpen className="w-10 h-10" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-xl font-black mb-2 line-clamp-1">{continueLearning.course.title}</h3>
                      <p className="text-sm text-zinc-500 mb-6">Giảng viên: {continueLearning.course.instructor.name}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold">Tiến độ khóa học</span>
                        <span className="text-blue-600 font-black">{Math.round(continueLearning.progress)}%</span>
                      </div>
                      <Progress value={continueLearning.progress} className="h-2 bg-zinc-100 dark:bg-zinc-900" />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 px-8 font-bold shadow-lg shadow-blue-600/20 group-hover:translate-x-1 transition-all">
                      <Link href={`/learn/${continueLearning.course.slug}`}>
                        <PlayCircle className="w-5 h-5 mr-2" /> Tiếp tục
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border-2 border-dashed">
                <BookOpen className="w-12 h-12 text-zinc-300 mb-4" />
                <p className="text-zinc-500 font-medium mb-6">Bạn chưa bắt đầu khóa học nào.</p>
                <Button asChild className="bg-blue-600 rounded-xl">
                  <Link href="/courses">Khám phá khóa học</Link>
                </Button>
              </div>
            )}
          </section>

          {/* Recent Courses List */}
          <section>
             <h2 className="text-2xl font-black mb-6">Các khóa học gần đây</h2>
             <div className="space-y-4">
                {enrollments.slice(1, 4).map((enrollment) => (
                  <Link 
                    key={enrollment.id} 
                    href={`/learn/${enrollment.course.slug}`}
                    className="flex items-center gap-4 p-4 rounded-3xl border bg-white dark:bg-zinc-950 hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 border bg-zinc-50">
                       <img src={enrollment.course.thumbnail || ""} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="font-bold truncate">{enrollment.course.title}</h4>
                       <div className="flex items-center gap-4 mt-1">
                          <Progress value={enrollment.progress} className="h-1.5 w-24 bg-zinc-100" />
                          <span className="text-xs font-bold text-zinc-400">{Math.round(enrollment.progress)}%</span>
                       </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
                {enrollments.length <= 1 && enrollments.length > 0 && (
                   <p className="text-sm text-zinc-500 italic">Bạn chỉ đang học 1 khóa học này.</p>
                )}
                {enrollments.length === 0 && (
                   <p className="text-sm text-zinc-500">Chưa có dữ liệu khóa học.</p>
                )}
             </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <Award className="w-12 h-12 mb-6 opacity-80" />
              <h3 className="text-2xl font-black mb-2">Thử thách mới?</h3>
              <p className="text-white/80 text-sm mb-8 leading-relaxed">Nâng cao kỹ năng của bạn với các khóa học AI Coding chuyên sâu ngay hôm nay.</p>
              <Button asChild className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-black h-12">
                 <Link href="/courses">Xem khoá học AI</Link>
              </Button>
           </div>

           <div className="bg-white dark:bg-zinc-950 border rounded-[2.5rem] p-8">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                 <Clock className="w-5 h-5 text-blue-600" />
                 Lịch sử học tập
              </h3>
              <div className="space-y-6">
                 {/* This could be fetched from a dedicated history table, using updatedAt for now */}
                 {enrollments.slice(0, 3).map((e) => (
                    <div key={e.id} className="relative pl-6 border-l-2 border-zinc-100 dark:border-zinc-800 pb-2">
                       <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white dark:bg-zinc-950 border-2 border-blue-600 rounded-full" />
                       <p className="text-xs font-bold text-zinc-400 mb-1">{new Date(e.updatedAt).toLocaleDateString("vi-VN")}</p>
                       <p className="text-sm font-bold line-clamp-1">{e.course.title}</p>
                       <p className="text-xs text-zinc-500 mt-1">Cập nhật tiến độ: {Math.round(e.progress)}%</p>
                    </div>
                 ))}
                 {enrollments.length === 0 && <p className="text-sm text-zinc-500">Chưa có hoạt động nào.</p>}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
