"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ShoppingCart, 
  Ticket, 
  Settings,
  ChevronLeft,
  Banknote,
  Activity,
  Newspaper,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"

const routes = [
  {
    label: "Tổng quan",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    color: "text-blue-500",
  },
  {
    label: "Người dùng",
    icon: Users,
    href: "/admin/users",
    color: "text-orange-500",
  },
  {
    label: "Khóa học",
    icon: BookOpen,
    href: "/admin/courses",
    color: "text-purple-500",
  },
  {
    label: "Đơn hàng",
    icon: ShoppingCart,
    href: "/admin/orders",
    color: "text-emerald-500",
  },
  {
    label: "Mã giảm giá",
    icon: Ticket,
    href: "/admin/coupons",
    color: "text-pink-500",
  },
  {
    label: "Rút tiền (Payouts)",
    icon: Banknote,
    href: "/admin/payouts",
    color: "text-amber-500",
  },
  {
    label: "Bài viết (Blog)",
    icon: Newspaper,
    href: "/admin/articles",
    color: "text-rose-500",
  },
  {
    label: "Nhật ký (Audit Logs)",
    icon: Activity,
    href: "/admin/audit-logs",
    color: "text-indigo-500",
  },
  {
    label: "Cấu hình",
    icon: Settings,
    href: "/admin/settings",
    color: "text-gray-500",
  },
]

export const AdminSidebar = () => {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
      <div className="px-6 py-2 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center">
          <div className="relative w-8 h-8 mr-2 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            V
          </div>
          <h1 className="text-xl font-black tracking-tight">
            Vibecode <span className="text-blue-600">Admin</span>
          </h1>
        </Link>
      </div>
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all",
                pathname === route.href ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 shadow-sm" : "text-zinc-500"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 border-t">
         <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center text-sm font-medium text-red-500 hover:text-red-600 transition-colors w-full"
         >
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất Admin
         </button>
      </div>
    </div>
  )
}
