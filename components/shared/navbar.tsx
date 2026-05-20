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
  ArrowRight,
  Check,
  Trash2,
  Clock,
  Award
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
import { CartSheet } from "@/components/cart/cart-sheet"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { toast } from "sonner"
import { 
  getNotifications, 
  markAllNotificationsAsRead, 
  markNotificationAsRead, 
  clearAllNotifications 
} from "@/lib/actions/notifications"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  
  const [notifications, setNotifications] = useState<any[]>([])
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const user = session?.user

  const unreadCount = notifications.filter(n => !n.isRead).length

  useEffect(() => {
    if (!user) {
      setNotifications([])
      return
    }

    const fetchNotifications = async () => {
      try {
        const res = await getNotifications()
        if (res && res.success && res.notifications) {
          setNotifications(res.notifications)
        }
      } catch (error) {
        console.error("Failed to load notifications:", error)
      }
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [user])

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    toast.success("Đã đánh dấu đọc tất cả thông báo!")
    
    const res = await markAllNotificationsAsRead()
    if (res && !res.success) {
      toast.error("Lỗi kết nối: Không thể cập nhật trạng thái trên hệ thống.")
    }
  }

  const handleClearNotifications = async () => {
    setNotifications([])
    toast.success("Đã xóa tất cả thông báo!")
    
    const res = await clearAllNotifications()
    if (res && !res.success) {
      toast.error("Lỗi kết nối: Không thể xóa thông báo trên hệ thống.")
    }
  }

  const handleNotificationClick = async (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    )
    
    if (id !== "welcome" && id !== "streak") {
      const res = await markNotificationAsRead(id)
      if (res && !res.success) {
        toast.error("Lỗi kết nối: Không thể cập nhật thông báo trên hệ thống.")
      }
    }
  }

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
              <CartSheet />
           </div>

           <div className="flex items-center gap-4">
              {user ? (
                 <div className="flex items-center gap-4">
                     <button 
                       onClick={() => setIsNotificationsOpen(true)}
                       className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-[#FF6600] transition-all relative group"
                       title="Thông báo"
                     >
                         <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                         {unreadCount > 0 && (
                           <span className="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 bg-red-500 rounded-full border border-white text-[8px] font-black text-white flex items-center justify-center animate-bounce">
                             {unreadCount}
                           </span>
                         )}
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
      {/* NOTIFICATIONS SLIDE DRAWER (SHEET) */}
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md rounded-l-[3rem] p-8 flex flex-col h-full overflow-hidden bg-white z-[99999] border-l border-zinc-100">
          <SheetHeader className="border-b pb-6 shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-black text-zinc-900 flex items-center gap-2">
                <Bell className="w-6 h-6 text-[#FF6600]" />
                Thông báo của bạn
              </SheetTitle>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {unreadCount} Mới
                </span>
              )}
            </div>
          </SheetHeader>

          {/* NOTIFICATION LIST */}
          <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id)}
                    className={cn(
                      "p-5 rounded-3xl border transition-all relative group flex flex-col gap-2 cursor-pointer",
                      notif.isRead
                        ? "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200"
                        : "bg-orange-50/20 border-orange-100 text-zinc-900 font-medium hover:bg-orange-50/30"
                    )}
                  >
                    {!notif.isRead && (
                      <span className="absolute top-5 right-5 w-2 h-2 bg-[#FF6600] rounded-full" />
                    )}

                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm",
                        notif.isRead ? "bg-zinc-100 text-zinc-400" : "bg-white text-[#FF6600] border border-orange-100"
                      )}>
                        {notif.id === "welcome" ? <Award className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div className="space-y-1 pr-4">
                        <h4 className="font-bold text-sm leading-snug">{notif.title}</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">{notif.message}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-100/50">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {typeof notif.createdAt === 'string' 
                          ? new Date(notif.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) 
                          : notif.createdAt.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={() => setIsNotificationsOpen(false)}
                          className="text-[10px] font-black text-[#FF6600] uppercase tracking-wider hover:underline flex items-center gap-1"
                        >
                          Xem chi tiết &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto text-zinc-300">
                  <Bell className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-zinc-500">Không có thông báo mới</p>
                  <p className="text-xs text-zinc-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                    Mọi thông báo về khóa học, tiến độ và tin nhắn sẽ được hiển thị tại đây.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          {notifications.length > 0 && (
            <div className="border-t pt-6 mt-auto shrink-0 flex gap-3">
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-wider border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50"
              >
                <Check className="w-4 h-4 mr-2" /> Đọc tất cả
              </Button>
              <Button
                variant="ghost"
                onClick={handleClearNotifications}
                className="h-12 w-12 rounded-xl border border-zinc-200 text-red-500 hover:text-red-600 hover:bg-red-50/50 flex items-center justify-center shrink-0"
                title="Xóa tất cả"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </nav>
  )
}
