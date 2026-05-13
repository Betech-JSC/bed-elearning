import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, BookOpen, Users, DollarSign, BarChart2, Heart, HelpCircle } from "lucide-react"

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
  const totalWishlists = courses.reduce((acc, c) => acc + c._count.wishlists, 0)
  const totalUnresolvedQuestions = courses.reduce((acc, course) => {
    return acc + course.sections.reduce((sAcc, section) => {
      return sAcc + section.lessons.reduce((lAcc, lesson) => lAcc + lesson._count.questions, 0)
    }, 0)
  }, 0)

  const stats = [
    { label: "Tổng khóa học", value: courses.length, icon: BookOpen, color: "bg-blue-50 text-blue-600" },
    { label: "Học viên", value: totalStudents, icon: Users, color: "bg-emerald-50 text-emerald-600" },
    { label: "Doanh thu ước tính", value: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalRevenue), icon: DollarSign, color: "bg-purple-50 text-purple-600" },
    { label: "Lượt yêu thích", value: totalWishlists, icon: Heart, color: "bg-pink-50 text-pink-600" },
    { label: "Câu hỏi chờ đáp", value: totalUnresolvedQuestions, icon: HelpCircle, color: "bg-orange-50 text-orange-600" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Bảng điều khiển Giảng viên</h1>
          <p className="text-zinc-500 mt-1">Quản lý các khóa học và theo dõi doanh thu của bạn.</p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="outline" className="rounded-xl font-bold gap-2">
            <Link href="/instructor/payouts">
              <DollarSign className="w-4 h-4" />
              Doanh thu & Rút tiền
            </Link>
          </Button>
          <Button asChild className="rounded-xl font-bold gap-2">
            <Link href="/instructor/courses/new">
              <PlusCircle className="w-4 h-4" />
              Tạo khóa học mới
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 flex items-center gap-5 shadow-sm">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} flex-shrink-0`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-zinc-500 font-medium whitespace-nowrap">{stat.label}</p>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Courses Table */}
      <div className="bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">Khóa học của tôi</h2>
          <BarChart2 className="w-5 h-5 text-zinc-400" />
        </div>
        {courses.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">Bạn chưa có khóa học nào.</p>
            <Button asChild className="mt-6 rounded-xl">
              <Link href="/instructor/courses/new">Tạo khóa học đầu tiên</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {courses.map((course) => (
              <div key={course.id} className="p-5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="font-bold">{course.title}</span>
                  <span className="text-xs text-zinc-500">{course._count.sections} chương • {course._count.enrollments} học viên</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    course.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-600" :
                    course.status === "PENDING_REVIEW" ? "bg-blue-50 text-blue-600" :
                    course.status === "REJECTED" ? "bg-red-50 text-red-600" :
                    "bg-zinc-100 text-zinc-600"
                  }`}>{course.status}</span>
                  <Button asChild variant="outline" size="sm" className="rounded-xl">
                    <Link href={`/instructor/courses/${course.id}/edit`}>Chỉnh sửa</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
