"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { DollarSign, Users, BookOpen, ShoppingBag, Clock, Heart, Banknote } from "lucide-react"

interface AdminStatsCardsProps {
  stats: {
    revenueToday: number
    revenueMonth: number
    revenueTotal: number
    newUsersToday: number
    pendingCourses: number
    ordersToday: number
    pendingPayouts: number
    totalWishlists: number
  }
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const cards = [
    {
      title: "Doanh thu hôm nay",
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenueToday),
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Doanh thu tháng này",
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenueMonth),
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      title: "Người dùng mới",
      value: stats.newUsersToday.toLocaleString(),
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      title: "Khóa học chờ duyệt",
      value: stats.pendingCourses,
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Yêu cầu rút tiền",
      value: stats.pendingPayouts,
      icon: Banknote,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-900/20"
    },
    {
      title: "Lượt yêu thích (Wishlist)",
      value: stats.totalWishlists.toLocaleString(),
      icon: Heart,
      color: "text-pink-600",
      bg: "bg-pink-50 dark:bg-pink-900/20"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="border-none shadow-sm overflow-hidden rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-black">{card.value}</p>
              </div>
              <div className={`${card.bg} p-3 rounded-xl`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function AdminRevenueChart({ data }: { data: any[] }) {
  return (
    <Card className="border-none shadow-sm rounded-2xl h-full">
      <CardHeader className="pb-8">
        <CardTitle className="text-xl font-bold">Doanh thu 30 ngày qua</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value), "Doanh thu"]}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2563eb" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAdminRev)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function TopCoursesChart({ data }: { data: any[] }) {
  return (
    <Card className="border-none shadow-sm rounded-2xl h-full">
      <CardHeader className="pb-8">
        <CardTitle className="text-xl font-bold">Top 10 khóa học bán chạy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="title" 
                type="category" 
                width={120} 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [value, "Đơn hàng"]}
              />
              <Bar 
                dataKey="sales" 
                fill="#8b5cf6" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
