"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, BookOpen, ShieldCheck } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const pathname = usePathname()
  const { items } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "Khóa học", href: "/courses" },
    { label: "Giảng viên", href: "/instructors" },
    { label: "Blog", href: "/blog" },
    { label: "Về chúng tôi", href: "/about" },
  ]

  const user = session?.user

  return (
    <nav className={cn(
      "fixed top-0 w-full z-[100] transition-all duration-300 h-20 flex items-center",
      isScrolled ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
        {/* LOGO */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
             <BookOpen className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-2xl font-black tracking-tighter transition-colors",
            !isScrolled && pathname === "/" ? "text-white" : "text-zinc-900 dark:text-white"
          )}>
            VIBECODE
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
           {navLinks.map((link) => (
             <Link 
               key={link.href} 
               href={link.href}
               className={cn(
                 "text-sm font-bold hover:text-blue-600 transition-colors",
                 !isScrolled && pathname === "/" ? "text-white/80 hover:text-white" : "text-zinc-600 dark:text-zinc-400"
               )}
             >
               {link.label}
             </Link>
           ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
           <Link href="/checkout" className="relative group">
              <div className={cn(
                "p-2 rounded-xl transition-all",
                !isScrolled && pathname === "/" ? "text-white hover:bg-white/10" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}>
                 <ShoppingCart className="w-6 h-6" />
                 {items.length > 0 && (
                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-950">
                     {items.length}
                   </span>
                 )}
              </div>
           </Link>

           <div className="hidden md:flex items-center gap-3">
              {user ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                       <Avatar className="w-10 h-10 border-2 border-white dark:border-zinc-800 shadow-md">
                          <AvatarImage src={user.image || ""} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                             {user.name?.[0].toUpperCase()}
                          </AvatarFallback>
                       </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-zinc-100 dark:border-zinc-800">
                       <DropdownMenuLabel className="font-black px-3 py-2">Tài khoản</DropdownMenuLabel>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem className="rounded-xl h-10 px-0 cursor-pointer">
                          <Link href="/dashboard" className="flex items-center gap-2 w-full h-full px-3">
                             <LayoutDashboard className="w-4 h-4" />
                             Bảng điều khiển
                          </Link>
                       </DropdownMenuItem>
                       <DropdownMenuItem className="rounded-xl h-10 px-0 cursor-pointer"><Link href="/my-courses" className="flex items-center gap-2 w-full h-full px-3">
                             <BookOpen className="w-4 h-4" />
                             Khóa học của tôi
                          </Link>
                       </DropdownMenuItem>
                       <DropdownMenuItem className="rounded-xl h-10 px-0 cursor-pointer"><Link href={user.role === "ADMIN" ? "/admin/dashboard" : "/instructor/dashboard"} className="flex items-center gap-2 w-full h-full px-3"><ShieldCheck className="w-4 h-4" />
                             Trang quản trị
                          </Link></DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem 
                          onClick={() => signOut()}
                          className="rounded-xl h-10 px-3 text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
              ) : (
                <>
                   <Link 
                     href="/login" 
                     className={cn(
                       "text-sm font-bold px-4 py-2 hover:text-blue-600 transition-colors",
                       !isScrolled && pathname === "/" ? "text-white" : "text-zinc-900 dark:text-white"
                     )}
                   >
                      Đăng nhập
                   </Link>
                   <Link 
                     href="/register" 
                     className={cn(
                       buttonVariants({ size: "sm" }), 
                       "bg-blue-600 hover:bg-blue-700 h-10 px-6 rounded-xl font-bold shadow-lg shadow-blue-600/20"
                     )}
                   >
                      Tham gia ngay
                   </Link>
                </>
              )}
           </div>

           {/* MOBILE MENU TOGGLE */}
           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className={cn(
               "md:hidden p-2 rounded-xl",
               !isScrolled && pathname === "/" ? "text-white hover:bg-white/10" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
             )}
           >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white dark:bg-zinc-950 border-b p-6 flex flex-col gap-6 md:hidden animate-in slide-in-from-top duration-300">
           {navLinks.map((link) => (
             <Link 
               key={link.href} 
               href={link.href}
               className="text-lg font-bold text-zinc-900 dark:text-white"
               onClick={() => setIsMobileMenuOpen(false)}
             >
               {link.label}
             </Link>
           ))}
           <div className="h-px bg-zinc-100" />
           {!user ? (
             <div className="flex flex-col gap-4">
                <Link href="/login" className="font-bold py-2">Đăng nhập</Link>
                <Button asChild className="bg-blue-600 h-12 rounded-xl font-bold">
                   <Link href="/register">Đăng ký</Link>
                </Button>
             </div>
           ) : (
             <Button 
               variant="ghost" 
               onClick={() => signOut()}
               className="justify-start px-0 text-red-500 font-bold"
             >
                Đăng xuất
             </Button>
           )}
        </div>
      )}
    </nav>
  )
}
