import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, BookOpen, Users, DollarSign, BarChart2, Heart, HelpCircle, ArrowRight, MessageSquare, TrendingUp, Search, Bell, ChevronRight } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import { formatPrice } from "@/lib/utils"

export default async function InstructorDashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return redirect("/login")
  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    return redirect("/")
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    include: {
      _count: { select: { enrollments: true, sections: true, wishlists: true } },
      enrollments: { select: { id: true } },
      sections: {
        include: {
          lessons: {
            include: {
              _count: { select: { questions: { where: { isResolved: false } } } }
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  const totalStudents = courses.reduce((acc, c) => acc + c._count.enrollments, 0)
  const totalRevenue = courses
    .filter(c => c.status === "PUBLISHED")
    .reduce((acc, c) => acc + c.price * c._count.enrollments, 0)
  
  const totalUnresolvedQuestions = courses.reduce((acc, course) => {
    return acc + course.sections.reduce((sAcc, section) => {
      return sAcc + section.lessons.reduce((lAcc, lesson) => lAcc + lesson._count.questions, 0)
    }, 0)
  }, 0)

  return (
    <div className="space-y-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <h1 className="text-5xl font-black tracking-tight text-zinc-900 mb-2">
             Instructor <span className="text-[#FF6600]">Dashboard</span>
           </h1>
           <p className="text-zinc-500 font-medium">Manage your academy and track your growth.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100 text-zinc-400 hover:text-zinc-900 cursor-pointer transition-all">
              <Search className="w-5 h-5" />
           </div>
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100 text-zinc-400 hover:text-zinc-900 cursor-pointer transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
           </div>
           <Button asChild className="bg-[#FF6600] hover:bg-orange-600 rounded-[1.5rem] h-14 px-8 font-black shadow-lg shadow-orange-500/20 ml-4">
              <Link href="/instructor/courses/new" className="flex items-center gap-2">
                 <PlusCircle className="w-5 h-5" />
                 New Course
              </Link>
           </Button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatCard 
            label="Total Revenue" 
            value={formatPrice(totalRevenue)} 
            icon={DollarSign} 
            color="orange"
            trend={{ value: "12%", positive: true }}
         />
         <StatCard 
            label="Total Students" 
            value={totalStudents} 
            icon={Users} 
            color="blue"
            trend={{ value: "5%", positive: true }}
         />
         <StatCard 
            label="Active Courses" 
            value={courses.filter(c => c.status === "PUBLISHED").length} 
            icon={BookOpen} 
            color="green"
         />
         <StatCard 
            label="Unresolved Q&A" 
            value={totalUnresolvedQuestions} 
            icon={MessageSquare} 
            color="purple"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content - Course Management */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-zinc-900">Recent Courses</h2>
              <Link href="/instructor/courses" className="text-sm font-black text-[#FF6600] flex items-center gap-1 hover:underline">
                View All Courses <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white border border-zinc-100 rounded-[3rem] shadow-sm overflow-hidden">
               {courses.length === 0 ? (
                  <div className="p-20 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-[#F8F9FA] rounded-3xl flex items-center justify-center mb-6">
                       <BookOpen className="w-10 h-10 text-zinc-300" />
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 mb-2">No courses yet</h3>
                    <p className="text-zinc-500 font-medium mb-10 max-w-sm">Share your knowledge with the world. Create your first course today.</p>
                    <Button asChild className="bg-zinc-900 hover:bg-zinc-800 rounded-[1.5rem] h-14 px-10 font-black">
                      <Link href="/instructor/courses/new">Create Course</Link>
                    </Button>
                  </div>
               ) : (
                  <div className="divide-y divide-zinc-50">
                    {courses.slice(0, 5).map((course) => (
                      <div key={course.id} className="p-8 flex items-center justify-between hover:bg-[#F8F9FA]/50 transition-all group">
                        <div className="flex items-center gap-6">
                           <div className="w-20 h-14 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-100 shrink-0 shadow-sm">
                              {course.thumbnail ? (
                                 <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                              ) : (
                                 <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                    <BookOpen className="w-6 h-6" />
                                 </div>
                              )}
                           </div>
                           <div className="flex flex-col gap-1">
                              <span className="font-black text-zinc-900 group-hover:text-[#FF6600] transition-colors">{course.title}</span>
                              <div className="flex items-center gap-4">
                                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{course._count.sections} Modules</span>
                                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{course._count.enrollments} Students</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest ${
                            course.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                            course.status === "PENDING_REVIEW" ? "bg-orange-50 text-orange-600 border border-orange-100" :
                            course.status === "REJECTED" ? "bg-red-50 text-red-600 border border-red-100" :
                            "bg-zinc-100 text-zinc-500 border border-zinc-200"
                          }`}>{course.status}</span>
                          <Button asChild variant="ghost" size="icon" className="rounded-xl h-12 w-12 hover:bg-white hover:shadow-md transition-all text-zinc-400 hover:text-zinc-900">
                            <Link href={`/instructor/courses/${course.id}/edit`}>
                               <TrendingUp className="w-5 h-5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
               )}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
             <h2 className="text-3xl font-black text-zinc-900 mb-8">Quick Insights</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#F8F9FA] p-10 rounded-[3rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all group">
                   <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                      <BarChart2 className="w-8 h-8 text-blue-600" />
                   </div>
                   <h3 className="text-2xl font-black mb-3">Analytics</h3>
                   <p className="text-zinc-500 font-medium mb-10 leading-relaxed text-sm">Deep dive into your performance metrics and student engagement.</p>
                   <Button asChild variant="outline" className="w-full h-14 rounded-2xl font-black border-zinc-200 hover:bg-white hover:text-[#FF6600]">
                      <Link href="/instructor/analytics">View Reports</Link>
                   </Button>
                </div>
                <div className="bg-[#F8F9FA] p-10 rounded-[3rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all group">
                   <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                      <DollarSign className="w-8 h-8 text-emerald-600" />
                   </div>
                   <h3 className="text-2xl font-black mb-3">Payouts</h3>
                   <p className="text-zinc-500 font-medium mb-10 leading-relaxed text-sm">Withdraw your earnings and manage your financial records.</p>
                   <Button asChild variant="outline" className="w-full h-14 rounded-2xl font-black border-zinc-200 hover:bg-white hover:text-[#FF6600]">
                      <Link href="/instructor/payouts">Request Payout</Link>
                   </Button>
                </div>
             </div>
          </section>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-10">
           {/* Instructor Resources */}
           <div className="bg-gradient-to-br from-[#8B3D00] to-[#FF6600] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                     <HelpCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-black mb-3 leading-tight">Teaching <br/>Academy</h3>
                  <p className="text-white/80 text-sm mb-10 leading-relaxed font-medium">New to teaching? Learn how to create high-quality course content.</p>
                  <Button asChild className="w-full bg-white text-[#FF6600] hover:bg-zinc-100 rounded-2xl font-black h-14 shadow-lg">
                     <Link href="/resources/teaching-guide">Learning Center</Link>
                  </Button>
              </div>
           </div>

           {/* Unresolved Questions */}
           <div className="bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-sm">
              <h3 className="text-xl font-black text-zinc-900 mb-8 flex items-center gap-3">
                 <MessageSquare className="w-6 h-6 text-[#FF6600]" />
                 Pending Questions
              </h3>
              <div className="space-y-8">
                 {totalUnresolvedQuestions > 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                       <p className="text-4xl font-black text-[#FF6600] mb-2">{totalUnresolvedQuestions}</p>
                       <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-8">Questions waiting for you</p>
                       <Button asChild variant="outline" className="w-full h-12 rounded-2xl font-black border-zinc-100">
                          <Link href="/instructor/qa">Answer Now</Link>
                       </Button>
                    </div>
                 ) : (
                    <div className="text-center py-10">
                       <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">All caught up!</p>
                       <p className="text-zinc-500 text-xs mt-2 font-medium">You have no pending questions.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
