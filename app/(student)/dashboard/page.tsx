import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { BookOpen, GraduationCap, Clock, Award, ChevronRight, PlayCircle, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/shared/stat-card"
import { StreakUpdater } from "@/components/shared/streak-updater"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import Image from "next/image"
import { cookies } from "next/headers"

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
          _count: {
            select: { sections: true }
          }
        }
      }
    },
    orderBy: { updatedAt: "desc" }
  })

  const totalCourses = enrollments.length
  const completedCourses = enrollments.filter(e => e.isCompleted).length
  
  // Get certificates
  const certificates = await prisma.certificate.count({
    where: { userId }
  })

  // Continue Learning (Last updated enrollment that is not completed)
  const continueLearning = enrollments.find(e => !e.isCompleted) || enrollments[0]

  // Fetch active courses list for instant client-side searching
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      thumbnail: true,
      price: true,
      salePrice: true,
      category: { select: { name: true } }
    }
  })

  // Check if they cleared notifications to prevent re-seeding
  const cookieStore = await cookies()
  const isCleared = cookieStore.get("belearning_notifications_cleared")?.value === "true"

  if (!isCleared) {
    const welcomeNotificationExists = await prisma.notification.findFirst({
      where: { userId, title: "Chào mừng đến với Belearning!" }
    })

    if (!welcomeNotificationExists) {
      await prisma.notification.createMany({
        data: [
          {
            userId,
            title: "Chào mừng đến với Belearning!",
            message: "Hôm nay là một ngày tuyệt vời để khám phá và tích lũy những kiến thức lập trình mới. Chúc bạn học tốt!",
            isRead: false,
            link: "/courses"
          },
          {
            userId,
            title: "Duy trì ngọn lửa học tập 🔥",
            message: "Hoàn thành bài giảng mỗi ngày để duy trì chuỗi Streak và nhận thêm điểm XP thưởng nhé!",
            isRead: false,
            link: null
          }
        ]
      })
    }
  }

  // Fetch in-app notifications
  const dbNotifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5
  })

  // Format notifications safely for client serializing
  const notifications = dbNotifications.map(n => ({
    id: n.id,
    title: n.title,
    message: n.message,
    isRead: n.isRead,
    link: n.link,
    createdAt: n.createdAt.toISOString()
  }))

  return (
    <div className="space-y-12">
      <StreakUpdater />
      {/* HEADER SECTION */}
      <DashboardHeader 
        userName={session?.user?.name || "Học viên"} 
        courses={courses}
        initialNotifications={notifications}
      />

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatCard 
            label="Khóa học đã đăng ký" 
            value={totalCourses} 
            icon={BookOpen} 
            color="orange"
         />
         <StatCard 
            label="Đã hoàn thành" 
            value={completedCourses} 
            icon={GraduationCap} 
            color="blue"
         />
         <StatCard 
            label="Đang học" 
            value={totalCourses - completedCourses} 
            icon={Clock} 
            color="green"
         />
         <StatCard 
            label="Chứng chỉ đạt được" 
            value={certificates} 
            icon={Award} 
            color="purple"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Continue Learning */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-zinc-900">Tiếp tục học tập</h2>
              <Link href="/my-courses" className="text-sm font-black text-[#FF6600] flex items-center gap-1 hover:underline">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {continueLearning ? (
              <div className="bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-sm group relative overflow-hidden transition-all hover:shadow-xl hover:shadow-orange-500/5">
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-50 rounded-bl-full -z-0 opacity-50 transition-transform group-hover:scale-110 duration-700" />
                
                <div className="flex flex-col md:flex-row gap-10 relative z-10">
                  <div className="w-full md:w-64 h-40 bg-zinc-100 rounded-3xl overflow-hidden shrink-0 shadow-sm border border-white">
                    {continueLearning.course.thumbnail ? (
                      <Image 
                        src={continueLearning.course.thumbnail} 
                        alt={continueLearning.course.title} 
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <BookOpen className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                         <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-black text-orange-600 border border-orange-100 shadow-sm uppercase tracking-widest">Đang học</span>
                         <span className="text-[10px] font-bold text-zinc-400">{continueLearning.course._count.sections} Chương học</span>
                      </div>
                      <h3 className="text-2xl font-black mb-2 text-zinc-900 group-hover:text-[#FF6600] transition-colors line-clamp-1">{continueLearning.course.title}</h3>
                      <p className="text-sm text-zinc-500 font-medium">Bởi {continueLearning.course.instructor.name}</p>
                    </div>

                    <div className="space-y-4 mt-6">
                      <div className="flex justify-between text-xs font-black mb-1">
                        <span className="text-zinc-400 uppercase tracking-widest">Tiến độ</span>
                        <span className="text-[#FF6600]">{Math.round(continueLearning.progress)}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                           className="h-full bg-[#FF6600] rounded-full transition-all duration-1000" 
                           style={{ width: `${continueLearning.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Button asChild className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-[1.5rem] h-16 px-10 font-black shadow-xl transition-all group-hover:scale-105">
                      <Link href={`/learn/${continueLearning.course.slug}`}>
                        <PlayCircle className="w-6 h-6 mr-2" /> Học tiếp
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-[#F8F9FA] rounded-[3rem] border-2 border-dashed border-zinc-200">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                   <BookOpen className="w-10 h-10 text-zinc-300" />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-2">Chưa bắt đầu khóa học nào</h3>
                <p className="text-zinc-500 font-medium mb-10 max-w-sm text-center">Sẵn sàng tham gia khóa học đầu tiên của bạn? Hãy khám phá danh mục để tìm kiếm đam mê.</p>
                <Button asChild className="bg-[#FF6600] hover:bg-orange-600 rounded-[1.5rem] h-14 px-10 font-black shadow-lg shadow-orange-500/20">
                  <Link href="/courses">Khám phá danh mục</Link>
                </Button>
              </div>
            )}
          </section>

          {/* Recent Courses */}
          <section>
             <h2 className="text-3xl font-black text-zinc-900 mb-8">Khóa học gần đây</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {enrollments.slice(1, 3).map((enrollment) => (
                  <Link 
                    key={enrollment.id} 
                    href={`/learn/${enrollment.course.slug}`}
                    className="flex flex-col p-6 rounded-[2.5rem] border border-zinc-100 bg-white hover:border-[#FF6600]/20 hover:shadow-xl hover:shadow-orange-500/5 transition-all group"
                  >
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 border border-zinc-100">
                       <Image 
                          src={enrollment.course.thumbnail || ""} 
                          alt="" 
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                       />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-lg text-zinc-900 group-hover:text-[#FF6600] transition-colors line-clamp-1">{enrollment.course.title}</h4>
                       </div>
                       <p className="text-xs text-zinc-400 font-bold mb-6">Bởi {enrollment.course.instructor.name}</p>
                       
                       <div className="flex items-center justify-between gap-4 mt-auto">
                          <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-[#FF6600] rounded-full" 
                                style={{ width: `${enrollment.progress}%` }}
                             />
                          </div>
                          <span className="text-xs font-black text-zinc-900">{Math.round(enrollment.progress)}%</span>
                       </div>
                    </div>
                  </Link>
                ))}
                {enrollments.length === 0 && (
                   <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-dashed border-zinc-100 flex flex-col items-center justify-center">
                      <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Chưa có hoạt động nào gần đây</p>
                   </div>
                )}
             </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
           {/* Promo Banner */}
           <div className="bg-gradient-to-br from-[#1A1A1A] to-[#333] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FF6600]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                     <Star className="w-8 h-8 text-[#FF6600]" />
                  </div>
                  <h3 className="text-3xl font-black mb-3 leading-tight">Làm chủ<br/>Kỹ năng mới</h3>
                  <p className="text-white/60 text-sm mb-10 leading-relaxed font-medium">Tham gia lộ trình học tập nâng cao để nhận chứng chỉ từ các chuyên gia đầu ngành.</p>
                  <Button asChild className="w-full bg-[#FF6600] hover:bg-orange-600 text-white rounded-2xl font-black h-14 shadow-lg shadow-orange-500/20">
                     <Link href="/courses">Bắt đầu ngay</Link>
                  </Button>
              </div>
           </div>

           {/* Activity Feed */}
           <div className="bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-sm">
              <h3 className="text-xl font-black text-zinc-900 mb-8 flex items-center gap-3">
                 <Clock className="w-6 h-6 text-[#FF6600]" />
                 Nhật ký hoạt động
              </h3>
              <div className="space-y-8">
                 {enrollments.slice(0, 4).map((e) => (
                    <div key={e.id} className="relative pl-8 border-l-2 border-zinc-100 pb-2 group">
                       <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-zinc-200 rounded-full group-hover:border-[#FF6600] group-hover:scale-125 transition-all" />
                       <p className="text-[10px] font-black text-zinc-400 mb-1 uppercase tracking-widest">{new Date(e.updatedAt).toLocaleDateString("vi-VN", { month: 'short', day: 'numeric' })}</p>
                       <p className="text-sm font-black text-zinc-900 group-hover:text-[#FF6600] transition-colors line-clamp-1">{e.course.title}</p>
                       <p className="text-xs text-zinc-500 mt-1 font-medium">Cập nhật tiến độ lên {Math.round(e.progress)}%</p>
                    </div>
                  ))}
                  {enrollments.length === 0 && (
                     <div className="text-center py-10">
                        <p className="text-sm text-zinc-400 font-bold uppercase tracking-widest">Chưa có hoạt động nào</p>
                     </div>
                  )}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
