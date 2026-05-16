"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  Star, 
  Settings, 
  LogOut,
  GraduationCap,
  Award,
  User,
  PlusCircle,
  Clock,
  HelpCircle,
  FileText,
  Trophy,
  Flame
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarRoute {
  label: string
  icon: any
  href: string
}

interface SidebarProps {
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT"
  user?: {
    name?: string | null
    image?: string | null
    roleLabel?: string
    xp?: number
    streak?: number
  }
}

const adminRoutes: SidebarRoute[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Quản lý khóa học", icon: BookOpen, href: "/admin/courses" },
  { label: "Người dùng", icon: Users, href: "/admin/users" },
  { label: "Phân tích", icon: BarChart3, href: "/admin/analytics" },
  { label: "Đánh giá", icon: Star, href: "/admin/reviews" },
  { label: "Cài đặt", icon: Settings, href: "/admin/settings" },
]

const instructorRoutes: SidebarRoute[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/instructor/dashboard" },
  { label: "Quản lý bài giảng", icon: BookOpen, href: "/instructor/courses" },
  { label: "Phân tích", icon: BarChart3, href: "/instructor/analytics" },
  { label: "Đánh giá", icon: Star, href: "/instructor/reviews" },
  { label: "Cài đặt", icon: Settings, href: "/instructor/settings" },
]

const studentRoutes: SidebarRoute[] = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Khóa học của tôi", icon: GraduationCap, href: "/my-courses" },
  { label: "Chứng chỉ", icon: Award, href: "/certificates" },
  { label: "Bảng xếp hạng", icon: Trophy, href: "/leaderboard" },
  { label: "Hồ sơ", icon: User, href: "/profile" },
  { label: "Cài đặt", icon: Settings, href: "/settings" },
]

export const AppSidebar = ({ role, user }: SidebarProps) => {
  const pathname = usePathname()
  
  const routes = role === "ADMIN" ? adminRoutes : role === "INSTRUCTOR" ? instructorRoutes : studentRoutes
  const title = role === "ADMIN" ? "Admin Portal" : role === "INSTRUCTOR" ? "Instructor Portal" : "Learning Dashboard"

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
      <div className="p-6">
        <Link href="/" className="flex flex-col">
          <span className="text-xl font-black text-[#FF6600]">Belearning</span>
          <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{title}</span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-2 space-y-1">
        {routes.map((route) => {
          const isActive = pathname === route.href || pathname?.startsWith(`${route.href}/`)
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-200",
                isActive 
                  ? "bg-white text-[#FF6600] shadow-sm shadow-orange-200/50 dark:shadow-none dark:bg-zinc-900" 
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              )}
            >
              <route.icon className={cn("w-5 h-5", isActive ? "text-[#FF6600]" : "text-zinc-400 group-hover:text-zinc-600")} />
              {route.label}
            </Link>
          )
        })}
      </div>

      {role === "INSTRUCTOR" && (
         <div className="px-4 mb-4">
            <Link 
                href="/instructor/courses/create"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#FF6600] text-white rounded-2xl font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-600 transition-all"
            >
                <PlusCircle className="w-5 h-5" />
                Tạo khóa học mới
            </Link>
         </div>
      )}

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback className="bg-orange-100 text-[#FF6600] font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-zinc-900 dark:text-white truncate">
              {user?.name || "Người dùng"}
            </span>
            <span className="text-[10px] text-zinc-500 font-medium truncate">
              {user?.roleLabel || (role === "ADMIN" ? "Quản trị viên" : role === "INSTRUCTOR" ? "Giảng viên" : "Học viên")}
            </span>
            {role === "STUDENT" && (
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        <Star className="w-3 h-3 text-indigo-500 fill-current" />
                        <span className="text-[10px] font-black text-indigo-600">{user?.xp || 0} XP</span>
                    </div>
                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                        <Flame className="w-3 h-3 text-[#FF6600] fill-current" />
                        <span className="text-[10px] font-black text-[#FF6600]">{user?.streak || 0} Streak</span>
                    </div>
                </div>
            )}
          </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-4 flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
