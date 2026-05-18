"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { 
  Search, 
  Menu, 
  X, 
  User, 
  BookOpen, 
  LogOut, 
  LayoutDashboard,
  Bell,
  ShoppingCart,
  ArrowRight
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10 || document.documentElement.scrollTop > 10 || document.body.scrollTop > 10
      setIsScrolled(scrolled)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "Khóa học", href: "/courses" },
    { label: "Giảng viên", href: "/instructors" },
    { label: "Blog", href: "/blog" },
    { label: "Về chúng tôi", href: "/about" },
  ]

  const user = session?.user

  // Hide Navbar on Learn pages (Video player)
  if (pathname.startsWith("/learn/")) return null

  return (
    <nav className={cn(
      "fixed top-0 w-full z-[9999] transition-all duration-500 h-24 flex items-center",
      isScrolled 
        ? "bg-white/95 backdrop-blur-3xl border-b border-zinc-100/80 shadow-md py-4" 
        : "bg-transparent py-6"
    )}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 w-full flex items-center justify-between gap-8">
        <div className="flex items-center gap-8 lg:gap-12 xl:gap-16 shrink-0">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 bg-[#FF6600] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-500">
               <span className="text-white font-black text-xl">B</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-zinc-900">
              Belearning
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
             {navLinks.map((link) => {
               const isActive = pathname === link.href
               return (
                 <Link 
                   key={link.href} 
                   href={link.href}
                   className={cn(
                     "text-[13px] font-black uppercase tracking-widest transition-all relative py-1 whitespace-nowrap",
                     isActive ? "text-[#FF6600]" : "text-zinc-500 hover:text-zinc-900"
                   )}
                 >
                   {link.label}
                   {isActive && (
                      <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#FF6600] rounded-full" />
                   )}
                 </Link>
               )
             })}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
           {/* Search & Cart Placeholder */}
           <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center bg-[#F1F3F5] rounded-2xl px-4 xl:px-5 py-3 w-48 xl:w-64 border border-transparent focus-within:border-orange-200 focus-within:bg-white transition-all shadow-inner">
                 <Search className="w-4 h-4 text-zinc-400 mr-3" />
                 <input 
                   type="text" 
                   placeholder="Tìm khóa học..." 
                   className="bg-transparent border-none text-xs font-bold focus:outline-none w-full text-zinc-900 placeholder:text-zinc-400"
                 />
              </div>
              <Link href="/cart" className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-[#FF6600] hover:bg-orange-50 transition-all relative">
                 <ShoppingCart className="w-5 h-5" />
                 <div className="absolute top-2 right-2 w-4 h-4 bg-[#FF6600] rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[8px] font-black text-white">0</span>
                 </div>
              </Link>
           </div>

           <div className="flex items-center gap-4">
              {user ? (
                 <div className="flex items-center gap-4">
                    <button className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-[#FF6600] transition-all">
                        <Bell className="w-5 h-5" />
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none">
                            <Avatar className="w-10 h-10 border-2 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform ring-2 ring-zinc-50">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="bg-orange-100 text-[#FF6600] font-black text-xs">{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-3 rounded-[2rem] border-zinc-100 shadow-2xl mt-4">
                            <div className="p-4 space-y-1 mb-2">
                                <p className="text-sm font-black text-zinc-900">{user.name}</p>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user.role}</p>
                            </div>
                            <DropdownMenuSeparator className="bg-zinc-50" />
                            <DropdownMenuItem>
                                <Link href={user.role === "ADMIN" ? "/admin/dashboard" : user.role === "INSTRUCTOR" ? "/instructor/dashboard" : "/profile"} className="rounded-xl h-11 px-3 cursor-pointer flex items-center gap-3 font-bold text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all w-full">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Bảng điều khiển
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/my-courses" className="rounded-xl h-11 px-3 cursor-pointer flex items-center gap-3 font-bold text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all w-full">
                                    <BookOpen className="w-4 h-4" />
                                    Khóa học của tôi
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-50" />
                            <DropdownMenuItem 
                                onClick={() => signOut()}
                                className="rounded-xl h-11 px-3 text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer flex items-center gap-3 font-bold text-xs"
                                >
                                <LogOut className="w-4 h-4" />
                                Đăng xuất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
              ) : (
                 <div className="flex items-center gap-4">
                    <Link 
                      href="/login" 
                      className="hidden sm:block text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-[#FF6600] transition-all px-4"
                    >
                       Đăng nhập
                    </Link>
                    <Link 
                      href="/register" 
                      className={cn(
                        buttonVariants({ size: "lg" }), 
                        "bg-[#FF6600] hover:bg-orange-600 h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 text-white border-none transition-all hover:scale-105 active:scale-95"
                      )}
                    >
                       Đăng ký
                    </Link>
                 </div>
              )}
           </div>

           {/* MOBILE MENU TOGGLE */}
           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="md:hidden w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900 hover:bg-zinc-100 transition-all"
           >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="absolute top-24 left-0 w-full bg-white border-b border-zinc-100 p-8 flex flex-col gap-8 md:hidden animate-in slide-in-from-top-12 duration-500 shadow-2xl rounded-b-[3rem]">
           <div className="flex flex-col gap-6">
               {navLinks.map((link) => (
                 <Link 
                   key={link.href} 
                   href={link.href}
                   className="text-2xl font-black text-zinc-900 hover:text-[#FF6600] transition-colors flex items-center justify-between"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   {link.label}
                   <ArrowRight className="w-5 h-5 opacity-20" />
                 </Link>
               ))}
           </div>
           <div className="h-px bg-zinc-50" />
           {!user ? (
             <div className="flex flex-col gap-6">
                <Link href="/login" className="text-lg font-black text-zinc-600" onClick={() => setIsMobileMenuOpen(false)}>Đăng nhập</Link>
                <Button asChild className="h-16 rounded-2xl bg-[#FF6600] hover:bg-orange-600 font-black text-sm uppercase tracking-widest text-white border-none shadow-xl shadow-orange-500/20">
                   <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Tham gia miễn phí</Link>
                </Button>
             </div>
           ) : (
             <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-[2rem]">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-black text-zinc-900">{user.name}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user.role}</p>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    onClick={() => {
                        setIsMobileMenuOpen(false)
                        signOut()
                    }}
                    className="w-full h-16 rounded-2xl bg-red-50 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-100"
                >
                    <LogOut className="w-4 h-4 mr-3" />
                    Đăng xuất
                </Button>
             </div>
           )}
        </div>
      )}
    </nav>
  )
}
