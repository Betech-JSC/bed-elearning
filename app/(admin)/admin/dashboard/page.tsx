import prisma from "@/lib/prisma"
import { AdminStatsCards, AdminRevenueChart, TopCoursesChart } from "@/components/admin/dashboard-stats"
import { startOfDay, startOfMonth, subDays, format } from "date-fns"
import { vi } from "date-fns/locale"

export default async function AdminDashboardPage() {
  const now = new Date()
  const todayStart = startOfDay(now)
  const monthStart = startOfMonth(now)
  const thirtyDaysAgo = subDays(todayStart, 30)

  // 1. Fetch KPI Stats
  const [
    revenueToday,
    revenueMonth,
    revenueTotal,
    newUsersToday,
    pendingCourses,
    ordersToday,
    pendingPayouts,
    totalWishlists
  ] = await Promise.all([
    // Revenue Today
    prisma.order.aggregate({
      where: { status: "PAID", updatedAt: { gte: todayStart } },
      _sum: { totalAmount: true }
    }).then(res => res._sum.totalAmount || 0),

    // Revenue Month
    prisma.order.aggregate({
      where: { status: "PAID", updatedAt: { gte: monthStart } },
      _sum: { totalAmount: true }
    }).then(res => res._sum.totalAmount || 0),

    // Revenue Total
    prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { totalAmount: true }
    }).then(res => res._sum.totalAmount || 0),

    // New Users Today
    prisma.user.count({
      where: { createdAt: { gte: todayStart } }
    }),

    // Pending Courses
    prisma.course.count({
      where: { status: "PENDING_REVIEW" }
    }),

    // Orders Today
    prisma.order.count({
      where: { createdAt: { gte: todayStart } }
    }),

    // Pending Payouts
    prisma.payout.count({
      where: { status: "PENDING" }
    }),

    // Total Wishlists
    prisma.wishlist.count()
  ])

  // 2. Fetch Chart Data (Revenue 30 days)
  // For MVP, we'll fetch last 30 days of paid orders and group in JS
  const recentOrders = await prisma.order.findMany({
    where: {
      status: "PAID",
      updatedAt: { gte: thirtyDaysAgo }
    },
    select: {
      totalAmount: true,
      updatedAt: true
    }
  })

  const revenueData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(todayStart, 29 - i)
    const dateStr = format(date, "dd/MM")
    const dayRevenue = recentOrders
      .filter(o => format(o.updatedAt, "dd/MM") === dateStr)
      .reduce((sum, o) => sum + o.totalAmount, 0)
    
    return { date: dateStr, revenue: dayRevenue }
  })

  // 3. Fetch Top 10 Selling Courses (using enrollments as proxy for MVP)
  const topCourses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    select: {
      title: true,
      _count: {
        select: { enrollments: true }
      }
    },
    orderBy: {
      enrollments: {
        _count: 'desc'
      }
    },
    take: 10
  })

  const topCoursesData = topCourses.map(c => ({
    title: c.title,
    sales: c._count.enrollments
  }))

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black mb-2 tracking-tight">Admin Dashboard</h1>
        <p className="text-zinc-500">Chào mừng quay trở lại. Đây là những gì đang diễn ra trên hệ thống.</p>
      </div>

      <AdminStatsCards 
        stats={{ 
            revenueToday, 
            revenueMonth, 
            revenueTotal, 
            newUsersToday, 
            pendingCourses, 
            ordersToday,
            pendingPayouts,
            totalWishlists
        }} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdminRevenueChart data={revenueData} />
        <TopCoursesChart data={topCoursesData} />
      </div>
    </div>
  )
}
