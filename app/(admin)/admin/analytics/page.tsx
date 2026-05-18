import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AnalyticsClient } from "@/components/admin/analytics-client"
import { BarChart3, TrendingUp } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminAnalyticsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return redirect("/login")
  }

  // Fetch all PAID orders to calculate analytics safely in JS
  const paidOrders = await prisma.order.findMany({
    where: { status: "PAID" },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      items: {
        include: {
          course: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  // Fetch all users to count student growth and active users
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      role: true,
      createdAt: true
    }
  })

  // Fetch all courses to calculate stats
  const allCourses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      status: true
    }
  })

  // 1. KPI Calculations
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const averageOrderValue = paidOrders.length > 0 
    ? Math.round(totalRevenue / paidOrders.length) 
    : 0
  const totalEnrollments = paidOrders.reduce((sum, order) => sum + order.items.length, 0)
  const totalStudents = allUsers.filter(u => u.role === "STUDENT").length
  const totalInstructors = allUsers.filter(u => u.role === "INSTRUCTOR").length
  const publishedCourses = allCourses.filter(c => c.status === "PUBLISHED").length

  // 2. Generate Past 30 Days Revenue Trend
  const dailyRevenueMap: { [dateStr: string]: number } = {}
  
  // Initialize past 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const label = d.toLocaleDateString("vi-VN", { day: "numeric", month: "short" })
    dailyRevenueMap[label] = 0
  }

  // Aggregate paid orders
  paidOrders.forEach(order => {
    const orderDate = new Date(order.createdAt)
    const label = orderDate.toLocaleDateString("vi-VN", { day: "numeric", month: "short" })
    if (dailyRevenueMap[label] !== undefined) {
      dailyRevenueMap[label] += order.totalAmount
    }
  })

  const dailyRevenueTrend = Object.keys(dailyRevenueMap).map(date => ({
    date,
    revenue: dailyRevenueMap[date]
  }))

  // 3. Course Popularity statistics (Top 5 Best Sellers)
  const courseSalesMap: { [courseId: string]: { title: string; sales: number } } = {}
  
  paidOrders.forEach(order => {
    order.items.forEach(item => {
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
  })

  const topCourses = Object.values(courseSalesMap)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  // 4. Payment Gateway distribution (Pie Chart)
  const paymentDistributionMap: { [method: string]: number } = {
    STRIPE: 0,
    VNPAY: 0,
    SEPAY: 0
  }

  paidOrders.forEach(order => {
    const method = order.paymentMethod || "VNPAY"
    if (paymentDistributionMap[method] !== undefined) {
      paymentDistributionMap[method] += order.totalAmount
    } else {
      paymentDistributionMap[method] = order.totalAmount
    }
  })

  const paymentDistribution = Object.keys(paymentDistributionMap).map(name => ({
    name: name === "STRIPE" ? "Stripe" : name === "VNPAY" ? "VNPay" : "Chuyển khoản (Sepay)",
    value: paymentDistributionMap[name]
  }))

  // 5. Recent transaction details (Last 5 orders)
  const recentTransactions = paidOrders.slice(0, 5).map(o => ({
    id: o.id,
    orderNumber: o.orderNumber,
    studentName: o.user.name || "Học viên",
    studentEmail: o.user.email || "",
    amount: o.totalAmount,
    method: o.paymentMethod || "VNPAY",
    date: o.createdAt
  }))

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
          <span className="bg-orange-500 text-white p-2 rounded-2xl">
            <BarChart3 className="w-6 h-6" />
          </span>
          Phân tích & Báo cáo
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-2">
          Theo dõi tổng quan doanh thu, xu hướng học tập và hiệu năng hoạt động của hệ thống Belearning.
        </p>
      </div>

      {/* Interactive Analytics Page Body Client-Side */}
      <AnalyticsClient 
        stats={{
          totalRevenue,
          averageOrderValue,
          totalEnrollments,
          totalStudents,
          totalInstructors,
          publishedCourses
        }}
        dailyRevenueTrend={dailyRevenueTrend}
        topCourses={topCourses}
        paymentDistribution={paymentDistribution}
        recentTransactions={recentTransactions}
      />
    </div>
  )
}
