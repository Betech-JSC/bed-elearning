"use client"

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts"
import { DollarSign, BookOpen, Users, ShoppingBag, ArrowUpRight, TrendingUp, BarChart3, Star, Wallet } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import { formatPrice } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface InstructorAnalyticsClientProps {
  userName: string
  notifications: any[]
  stats: {
    totalRevenue: number
    averageOrderValue: number
    totalEnrollments: number
    publishedCourses: number
    totalCourses: number
  }
  dailyRevenueTrend: { date: string; revenue: number }[]
  topCourses: { title: string; sales: number }[]
  recentTransactions: {
    id: string
    orderNumber: string
    studentName: string
    studentEmail: string
    studentImage: string | null
    courseTitle: string
    amount: number
    method: string
    date: Date | string
  }[]
  coursesForSearch: any[]
}

const COLORS = ["#FF6600", "#3B82F6", "#10B981", "#8B5CF6", "#EC4899"]

export function InstructorAnalyticsClient({
  userName,
  notifications,
  stats,
  dailyRevenueTrend,
  topCourses,
  recentTransactions,
  coursesForSearch
}: InstructorAnalyticsClientProps) {
  return (
    <div className="space-y-8">
      {/* 1. Header with integrated notifications & search */}
      <DashboardHeader 
        userName={userName}
        courses={coursesForSearch}
        initialNotifications={notifications}
        title={
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
            <span className="bg-orange-500 text-white p-2 rounded-2xl">
              <BarChart3 className="w-6 h-6" />
            </span>
            Phân tích & Báo cáo
          </h1>
        }
        subtitle="Theo dõi chi tiết hiệu quả doanh thu, doanh số và tương tác học viên của bạn."
      />

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Tổng doanh thu" 
          value={formatPrice(stats.totalRevenue)} 
          icon={DollarSign} 
          color="orange"
        />
        <StatCard 
          label="Tổng lượt đăng ký (Doanh số)" 
          value={stats.totalEnrollments} 
          icon={ShoppingBag} 
          color="blue"
        />
        <StatCard 
          label="Đơn hàng trung bình (AOV)" 
          value={formatPrice(stats.averageOrderValue)} 
          icon={TrendingUp} 
          color="green"
        />
        <StatCard 
          label="Khóa học xuất bản" 
          value={`${stats.publishedCourses} / ${stats.totalCourses}`} 
          icon={BookOpen} 
          color="purple"
        />
      </div>

      {/* 3. Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Stream Over Time */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden p-6 md:p-8">
          <CardHeader className="p-0 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-zinc-900 dark:text-zinc-50">Doanh thu 30 ngày qua</CardTitle>
                <p className="text-xs text-zinc-400 font-medium mt-1">Biểu đồ dòng tiền thực tế tích lũy hàng ngày.</p>
              </div>
              <div className="px-3.5 py-1 bg-orange-50 dark:bg-orange-950/20 text-[#FF6600] rounded-full text-[9px] font-black uppercase tracking-widest border border-orange-100/50 dark:border-orange-900/30">
                Thời gian thực
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full">
              {dailyRevenueTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyRevenueTrend}>
                    <defs>
                      <linearGradient id="colorInstructorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6600" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#FF6600" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-zinc-800" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px', background: '#fff' }}
                      itemStyle={{ fontSize: '11px', fontWeight: 900, color: '#FF6600' }}
                      labelStyle={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}
                      formatter={(value: any) => [formatPrice(value), "Doanh thu"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#FF6600" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorInstructorRev)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 text-xs">
                  Chưa có dữ liệu giao dịch trong 30 ngày qua.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Courses Sales Split */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden p-6 md:p-8">
          <CardHeader className="p-0 mb-8">
            <div>
              <CardTitle className="text-lg font-black text-zinc-900 dark:text-zinc-50">Top khóa học bán chạy</CardTitle>
              <p className="text-xs text-zinc-400 font-medium mt-1">Số lượng lượt đăng ký của top khóa học.</p>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex flex-col justify-center h-full min-h-[220px]">
            {topCourses.length > 0 ? (
              <div className="space-y-6 w-full">
                {topCourses.map((course, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[180px]">{course.title}</span>
                      <span className="font-black text-[#FF6600]">{course.sales} lượt đăng ký</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${(course.sales / Math.max(...topCourses.map(c => c.sales))) * 100}%`,
                          backgroundColor: COLORS[idx % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-400 text-xs font-medium">
                Chưa ghi nhận lượt đăng ký nào.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. Recent Sales Transactions */}
      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden p-6 md:p-8">
        <CardHeader className="p-0 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-black text-zinc-900 dark:text-zinc-50">Lịch sử đăng ký khóa học gần đây</CardTitle>
            <p className="text-xs text-zinc-400 font-medium mt-1">Danh sách học viên mua khóa học của bạn.</p>
          </div>
          <Button asChild className="bg-zinc-950 hover:bg-zinc-900 text-white rounded-2xl h-11 px-6 font-black text-xs self-start md:self-auto">
            <Link href="/instructor/payouts" className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              Xem thu nhập của tôi
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <th className="pb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Học viên</th>
                    <th className="pb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Khóa học</th>
                    <th className="pb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Thời gian</th>
                    <th className="pb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Số tiền</th>
                    <th className="pb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Phương thức</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#F8F9FA]/30 dark:hover:bg-zinc-900/30 transition-all group">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-zinc-600 overflow-hidden border">
                            {tx.studentImage ? (
                              <img src={tx.studentImage} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <span className="font-bold text-xs uppercase">{tx.studentName.slice(0, 2)}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-black text-zinc-800 dark:text-zinc-200 group-hover:text-[#FF6600] transition-colors">{tx.studentName}</p>
                            <p className="text-[10px] text-zinc-400 font-medium">{tx.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="text-xs font-black text-zinc-700 dark:text-zinc-300 truncate max-w-[200px] block">
                          {tx.courseTitle}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400">Mã đơn: #{tx.orderNumber.slice(0, 8).toUpperCase()}</span>
                      </td>
                      <td className="py-4 pr-4 text-xs font-medium text-zinc-500">
                        {new Date(tx.date).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="py-4 pr-4 text-xs font-black text-zinc-900 dark:text-zinc-100">
                        {formatPrice(tx.amount)}
                      </td>
                      <td className="py-4">
                        <span className="text-[9px] font-black bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          {tx.method}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-zinc-400 text-xs font-medium">
              Chưa ghi nhận bất kỳ giao dịch đăng ký khóa học nào.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
