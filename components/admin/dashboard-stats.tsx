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
import { DollarSign, Users, BookOpen, ShoppingBag, Clock, Heart, Banknote, Star, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import { formatPrice } from "@/lib/utils"

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <StatCard 
        label="Today's Revenue" 
        value={formatPrice(stats.revenueToday)} 
        icon={DollarSign} 
        color="orange"
      />
      <StatCard 
        label="Monthly Revenue" 
        value={formatPrice(stats.revenueMonth)} 
        icon={TrendingUp} 
        color="blue"
      />
      <StatCard 
        label="New Users" 
        value={stats.newUsersToday} 
        icon={Users} 
        color="green"
      />
      <StatCard 
        label="Pending Courses" 
        value={stats.pendingCourses} 
        icon={Clock} 
        color="purple"
      />
      <StatCard 
        label="Pending Payouts" 
        value={stats.pendingPayouts} 
        icon={Banknote} 
        color="orange"
      />
      <StatCard 
        label="Wishlists" 
        value={stats.totalWishlists} 
        icon={Heart} 
        color="purple"
      />
    </div>
  )
}

export function AdminRevenueChart({ data }: { data: any[] }) {
  return (
    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-8">
      <CardHeader className="p-0 mb-10">
        <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-black text-zinc-900">Revenue (Last 30 Days)</CardTitle>
            <div className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">Live Data</div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6600" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#FF6600" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 900, color: '#FF6600' }}
                labelStyle={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                formatter={(value: any) => [formatPrice(value), "Revenue"]}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#FF6600" 
                strokeWidth={4}
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
    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-8">
      <CardHeader className="p-0 mb-10">
        <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-black text-zinc-900">Top 10 Best Sellers</CardTitle>
            <div className="px-4 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">Most Popular</div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[350px] w-full">
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
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
              />
              <Tooltip 
                cursor={{ fill: '#F8F9FA', radius: 12 }}
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 900, color: '#2563eb' }}
                labelStyle={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                formatter={(value: any) => [value, "Enrollments"]}
              />
              <Bar 
                dataKey="sales" 
                fill="#2563eb" 
                radius={[0, 12, 12, 0]} 
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
