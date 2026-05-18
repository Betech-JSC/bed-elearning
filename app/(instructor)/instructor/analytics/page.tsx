import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { BarChart3 } from "lucide-react"
import { InstructorAnalyticsClient } from "@/components/instructor/analytics-client"

export const dynamic = "force-dynamic"

export default async function InstructorAnalyticsPage() {
  const session = await auth()
  if (!session?.user?.id) return redirect("/login")
  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    return redirect("/")
  }

  const userId = session.user.id

  // 1. Query all paid order items of instructor's courses
  const paidOrderItems = await prisma.orderItem.findMany({
    where: {
      order: { status: "PAID" },
      course: { instructorId: userId }
    },
    include: {
      course: {
        select: {
          id: true,
          title: true
        }
      },
      order: {
        select: {
          id: true,
          orderNumber: true,
          paymentMethod: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        }
      }
    },
    orderBy: {
      order: {
        createdAt: "desc"
      }
    }
  })

  // 2. Fetch notifications for instructor header
  const cookieStore = await cookies()
  const isCleared = cookieStore.get("belearning_notifications_cleared")?.value === "true"

  if (!isCleared) {
    const welcomeExists = await prisma.notification.findFirst({
      where: { userId, title: "Chào mừng đến với Belearning!" }
    })
    if (!welcomeExists) {
      await prisma.notification.create({
        data: {
          userId,
          title: "Chào mừng đến với Belearning!",
          message: "Hôm nay là một ngày tuyệt vời để quản lý học viện và theo dõi hiệu suất giảng dạy của bạn. Chúc bạn một ngày tốt lành!",
          isRead: false,
          link: "/instructor"
        }
      })
    }
  }

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  })

  // 3. Count other metadata
  const totalCourses = await prisma.course.count({
    where: { instructorId: userId }
  })

  const publishedCourses = await prisma.course.count({
    where: { instructorId: userId, status: "PUBLISHED" }
  })

  // 4. Calculate key metrics
  const totalRevenue = paidOrderItems.reduce((sum, item) => sum + item.price, 0)
  const totalEnrollments = paidOrderItems.length
  const averageOrderValue = totalEnrollments > 0 ? Math.round(totalRevenue / totalEnrollments) : 0

  // 5. Generate Past 30 Days daily revenue stream
  const dailyRevenueMap: { [dateStr: string]: number } = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const label = d.toLocaleDateString("vi-VN", { day: "numeric", month: "short" })
    dailyRevenueMap[label] = 0
  }

  paidOrderItems.forEach(item => {
    const dateLabel = new Date(item.order.createdAt).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })
    if (dailyRevenueMap[dateLabel] !== undefined) {
      dailyRevenueMap[dateLabel] += item.price
    }
  })

  const dailyRevenueTrend = Object.keys(dailyRevenueMap).map(date => ({
    date,
    revenue: dailyRevenueMap[date]
  }))

  // 6. Calculate Top 5 best sellers by enrollments
  const courseSalesMap: { [courseId: string]: { title: string; sales: number } } = {}
  paidOrderItems.forEach(item => {
    if (item.course) {
      if (!courseSalesMap[item.course.id]) {
        courseSalesMap[item.course.id] = {
          title: item.course.title,
          sales: 0
        }
      }
      courseSalesMap[item.course.id].sales += 1
    }
  })

  const topCourses = Object.values(courseSalesMap)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  // 7. Recent Transactions (Last 5 sales)
  const recentTransactions = paidOrderItems.slice(0, 5).map(item => ({
    id: item.id,
    orderNumber: item.order.orderNumber,
    studentName: item.order.user.name || "Học viên",
    studentEmail: item.order.user.email || "",
    studentImage: item.order.user.image,
    courseTitle: item.course.title,
    amount: item.price,
    method: item.order.paymentMethod || "VNPAY",
    date: item.order.createdAt
  }))

  // Formulate courses list for search component
  const coursesForSearch = coursesForSearchMapper(paidOrderItems)

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      {/* Interactive Instructor Analytics Client */}
      <InstructorAnalyticsClient 
        userName={session.user.name || "Giảng viên"}
        notifications={notifications}
        stats={{
          totalRevenue,
          averageOrderValue,
          totalEnrollments,
          publishedCourses,
          totalCourses
        }}
        dailyRevenueTrend={dailyRevenueTrend}
        topCourses={topCourses}
        recentTransactions={recentTransactions}
        coursesForSearch={coursesForSearch}
      />
    </div>
  )
}

function coursesForSearchMapper(orderItems: any[]) {
  const map: { [id: string]: any } = {}
  orderItems.forEach(item => {
    if (item.course && !map[item.course.id]) {
      map[item.course.id] = {
        id: item.course.id,
        title: item.course.title,
        slug: item.course.id, // placeholder slug
        thumbnail: null,
        price: item.price,
        salePrice: item.price,
        category: null
      }
    }
  })
  return Object.values(map)
}
