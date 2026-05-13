import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { StatsCards, RevenueChart } from "@/components/instructor/dashboard-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { format, subDays } from "date-fns"
import { vi } from "date-fns/locale"

export default async function InstructorDashboardPage() {
  const session = await auth()
  const userId = session?.user?.id
  const role = session?.user?.role

  if (!userId || (role !== "INSTRUCTOR" && role !== "ADMIN")) {
    return redirect("/")
  }

  // 1. Fetch Basic Stats
  const courses = await prisma.course.findMany({
    where: { instructorId: userId },
    include: {
      enrollments: true,
      reviews: true,
      orderItems: {
        where: { order: { status: "PAID" } }
      }
    }
  })

  const totalRevenue = courses.reduce((acc, c) => acc + c.orderItems.reduce((sum, oi) => sum + oi.price, 0), 0) * 0.7 // 70% share
  const totalStudents = new Set(courses.flatMap(c => c.enrollments.map(e => e.userId))).size
  const totalCourses = courses.length
  
  const allRatings = courses.flatMap(c => c.reviews.map(r => r.rating))
  const averageRating = allRatings.length > 0 ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : 0

  // 2. Fetch Chart Data (Last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i)
    return format(date, "dd/MM")
  }).reverse()

  // Simplified chart data for MVP - in reality we would group by day in SQL
  const revenueData = last30Days.map((date, i) => ({
    date,
    revenue: (totalRevenue / 30) * (0.5 + Math.random()) // Mock distribution
  }))

  // 3. Fetch Recent Reviews
  const recentReviews = await prisma.review.findMany({
    where: {
      course: { instructorId: userId }
    },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      course: { select: { title: true } }
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <div>
        <h1 className="text-4xl font-black mb-2">Xin chào, {session.user.name} 👋</h1>
        <p className="text-zinc-500">Chào mừng bạn quay lại bảng điều khiển giảng viên.</p>
      </div>

      <StatsCards stats={{ totalRevenue, totalStudents, totalCourses, averageRating }} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        
        <div className="lg:col-span-1">
          <Card className="border-none shadow-sm h-full rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Đánh giá mới nhất</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentReviews.length > 0 ? recentReviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarImage src={review.user.image || ""} />
                      <AvatarFallback>{review.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold">{review.user.name}</p>
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-blue-600 font-medium line-clamp-1">{review.course.title}</p>
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        &quot;{review.comment || "Không có bình luận."}&quot;
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-zinc-500 py-12 italic">Chưa có đánh giá nào.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
