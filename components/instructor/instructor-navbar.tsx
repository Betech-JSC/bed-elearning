"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  Settings,
  Bell,
  Search,
  ChevronDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function InstructorNavbar() {
  const { data: session } = useSession()
  const user = session?.user

  if (!user) return null

  return (
    <nav className="h-20 border-b bg-white dark:bg-zinc-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Left: Logo & Context */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
               <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter">VIBECODE</span>
          </Link>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-zinc-500 rounded-xl">
            <Bell className="w-5 h-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center gap-3 p-1 pl-1 pr-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-2xl transition-colors border border-transparent hover:border-zinc-200">
                <Avatar className="w-8 h-8 border shadow-sm">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xs">
                    {user.name?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black leading-none">{user.name}</p>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider font-bold">{user.role}</p>
                </div>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-zinc-100 dark:border-zinc-800">
              <DropdownMenuLabel className="flex flex-col gap-1 px-3 py-3">
                <p className="font-black text-sm">{user.name}</p>
                <p className="text-xs text-zinc-500 font-medium truncate">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl h-11 cursor-pointer focus:bg-zinc-50">
                <Link href="/profile" className="flex items-center gap-3 w-full h-full px-3">
                  <Settings className="w-4 h-4 text-zinc-500" />
                  <span className="font-bold text-sm">Cài đặt tài khoản</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl h-11 cursor-pointer focus:bg-zinc-50">
                <Link href="/instructor/payouts" className="flex items-center gap-3 w-full h-full px-3">
                  <DollarSign className="w-4 h-4 text-zinc-500" />
                  <span className="font-bold text-sm">Thu nhập & Thanh toán</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-xl h-11 px-3 text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-bold text-sm">Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

const DollarSign = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)
