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
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import { DollarSign, BookOpen, Users, ShoppingBag, ArrowUpRight, TrendingUp, Landmark } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import { formatPrice } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AnalyticsClientProps {
  stats: {
    totalRevenue: number
    averageOrderValue: number
    totalEnrollments: number
    totalStudents: number
    totalInstructors: number
    publishedCourses: number
  }
  dailyRevenueTrend: { date: string; revenue: number }[]
  topCourses: { title: string; sales: number }[]
  paymentDistribution: { name: string; value: number }[]
  recentTransactions: {
    id: string
    orderNumber: string
    studentName: string
    studentEmail: string
    amount: number
    method: string
    date: Date
  }[]
}

const COLORS = ["#FF6600", "#2563EB", "#8B5CF6"]

export function AnalyticsClient({
  stats,
  dailyRevenueTrend,
  topCourses,
  paymentDistribution,
  recentTransactions
}: AnalyticsClientProps) {
  return (
    <div className="space-y-8">
      {/* 1. Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        <StatCard 
          label="Tổng doanh thu" 
          value={formatPrice(stats.totalRevenue)} 
          icon={DollarSign} 
          color="orange"
        />
        <StatCard 
          label="Đơn hàng TB (AOV)" 
          value={formatPrice(stats.averageOrderValue)} 
          icon={TrendingUp} 
          color="blue"
        />
        <StatCard 
          label="Lượt đăng ký" 
          value={stats.totalEnrollments} 
          icon={ShoppingBag} 
          color="green"
        />
        <StatCard 
          label="Học viên" 
          value={stats.totalStudents} 
          icon={Users} 
          color="purple"
        />
        <StatCard 
          label="Giảng viên" 
          value={stats.totalInstructors} 
          icon={Users} 
          color="orange"
        />
        <StatCard 
          label="Khóa học online" 
          value={stats.publishedCourses} 
          icon={BookOpen} 
          color="blue"
        />
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden p-6 md:p-8">
          <CardHeader className="p-0 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-zinc-900 dark:text-zinc-50">Doanh thu 30 ngày qua</CardTitle>
                <p className="text-xs text-zinc-400 font-medium mt-1">Biểu diễn dòng tiền thực tế hàng ngày trên toàn hệ thống.</p>
              </div>
              <div className="px-3.5 py-1 bg-orange-50 dark:bg-orange-950/20 text-[#FF6600] rounded-full text-[9px] font-black uppercase tracking-widest border border-orange-100/50 dark:border-orange-900/30">
                Thời gian thực
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyRevenueTrend}>
                  <defs>
                    <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#colorAdminRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Gateway Split (Pie Chart) */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden p-6 md:p-8">
          <CardHeader className="p-0 mb-8">
            <div>
              <CardTitle className="text-lg font-black text-zinc-900 dark:text-zinc-50">Phương thức thanh toán</CardTitle>
              <p className="text-xs text-zinc-400 font-medium mt-1">Tỷ trọng doanh thu theo từng cổng.</p>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex flex-col items-center justify-center">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [formatPrice(value), "Doanh thu"]}
                    contentStyle={{ borderRadius: '16px', border: 'none', padding: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legends */}
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {paymentDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Courses (Bar Chart) */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden p-6 md:p-8">
          <CardHeader className="p-0 mb-8">
            <div>
              <CardTitle className="text-lg font-black text-zinc-900 dark:text-zinc-50">Top 5 Khóa học bán chạy</CardTitle>
              <p className="text-xs text-zinc-400 font-medium mt-1">Xếp hạng theo số học viên ghi danh.</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {topCourses.length > 0 ? (
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCourses} layout="vertical" margin={{ left: -10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" className="dark:stroke-zinc-800" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="title" 
                      type="category" 
                      width={100} 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 9, fill: '#64748b', fontWeight: 700 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#F8F9FA', radius: 8 }}
                      contentStyle={{ borderRadius: '16px', border: 'none', padding: '10px' }}
                      formatter={(value: any) => [value, "Đơn hàng"]}
                    />
                    <Bar 
                      dataKey="sales" 
                      fill="#FF6600" 
                      radius={[0, 8, 8, 0]} 
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-zinc-400 text-xs font-bold uppercase tracking-wider">
                Chưa có dữ liệu bán hàng
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions List */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden p-6 md:p-8">
          <CardHeader className="p-0 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-zinc-900 dark:text-zinc-50">Giao dịch gần đây</CardTitle>
                <p className="text-xs text-zinc-400 font-medium mt-1">Danh sách giao dịch thành công mới nhất.</p>
              </div>
              <Button asChild variant="outline" className="rounded-xl border-zinc-100 hover:border-zinc-200 text-xs font-bold gap-1.5 h-10">
                <Link href="/admin/orders">
                  Xem tất cả
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                      <th className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pb-3">Mã đơn</th>
                      <th className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pb-3">Học viên</th>
                      <th className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pb-3">Phương thức</th>
                      <th className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pb-3">Ngày</th>
                      <th className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pb-3 text-right">Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-zinc-50 dark:border-zinc-850 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="py-4 text-xs font-black text-zinc-900 dark:text-zinc-100">
                          #{tx.orderNumber.substring(0, 8)}...
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">{tx.studentName}</span>
                            <span className="text-[9px] text-zinc-400 font-bold">{tx.studentEmail}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-black rounded-lg uppercase tracking-wider">
                            <Landmark className="w-3 h-3 text-zinc-400" />
                            {tx.method}
                          </span>
                        </td>
                        <td className="py-4 text-xs font-bold text-zinc-500">
                          {new Date(tx.date).toLocaleDateString("vi-VN", {
                            day: "numeric",
                            month: "short"
                          })}
                        </td>
                        <td className="py-4 text-xs font-black text-right text-emerald-600 dark:text-emerald-500">
                          +{formatPrice(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-400 text-xs font-bold uppercase tracking-wider">
                Chưa phát sinh giao dịch nào
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
