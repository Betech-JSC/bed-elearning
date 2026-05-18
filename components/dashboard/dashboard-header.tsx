"use client"

import { useState } from "react"
import { Search, Bell, BookOpen, Clock, Award, Sparkles, AlertCircle, Check, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { markAllNotificationsAsRead, markNotificationAsRead, clearAllNotifications } from "@/lib/actions/notifications"

interface CourseListItem {
  id: string
  title: string
  slug: string
  thumbnail: string | null
  price: number
  salePrice: number
  category: { name: string } | null
}

interface NotificationItem {
  id: string
  title: string
  message: string
  isRead: boolean
  link: string | null
  createdAt: Date | string
}

interface DashboardHeaderProps {
  userName: string
  courses: CourseListItem[]
  initialNotifications: NotificationItem[]
  title?: React.ReactNode
  subtitle?: string
}

export function DashboardHeader({
  userName,
  courses = [],
  initialNotifications = [],
  title,
  subtitle
}: DashboardHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)

  const unreadCount = notifications.filter(n => !n.isRead).length

  // Filter courses instantly on client side
  const filteredCourses = searchQuery.trim() === ""
    ? []
    : courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

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

  return (
    <>
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          {title ? (
            title
          ) : (
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-2">
              Chào mừng trở lại, <span className="text-[#FF6600]">{userName || "Học viên"}</span>!
            </h1>
          )}
          <p className="text-zinc-500 font-medium">
            {subtitle || "Hôm nay là một ngày tuyệt vời để học thêm điều mới."}
          </p>
        </div>
        
        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-4">
          {/* Search Button Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:text-[#FF6600] hover:border-orange-200 transition-all hover:scale-105 active:scale-95 group"
            title="Tìm kiếm khóa học"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Notifications Button Trigger */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:text-[#FF6600] hover:border-orange-200 transition-all hover:scale-105 active:scale-95 relative group"
            title="Thông báo"
          >
            <Bell className="w-5 h-5 group-hover:animate-swing transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 bg-red-500 rounded-full border-2 border-white text-[9px] font-black text-white flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* SEARCH MODAL DIALOG */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 overflow-hidden">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl font-black text-zinc-900 flex items-center gap-2">
              <Search className="w-6 h-6 text-[#FF6600]" />
              Tìm kiếm khóa học
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên khóa học hoặc danh mục..."
                className="pl-12 h-14 rounded-2xl bg-zinc-50 border-zinc-200 text-base font-medium focus-visible:ring-[#FF6600]/20"
                autoFocus
              />
            </div>

            {/* SEARCH RESULTS */}
            <div className="max-h-[400px] overflow-y-auto pr-1">
              {searchQuery.trim() === "" ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto text-[#FF6600]">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-800">Tìm kiếm khóa học ngay lập tức</p>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed mt-1">
                      Nhập từ khóa liên quan đến lập trình, AI, Web hay di động để khám phá các bài giảng tốt nhất.
                    </p>
                  </div>
                </div>
              ) : filteredCourses.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs font-black uppercase text-zinc-400 tracking-wider">Kết quả tìm kiếm ({filteredCourses.length})</p>
                  {filteredCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-4 p-3 rounded-2xl border border-zinc-100 hover:border-orange-200 hover:bg-orange-50/20 transition-all group"
                    >
                      <div className="w-20 h-12 bg-zinc-100 rounded-xl overflow-hidden shrink-0 relative border">
                        {course.thumbnail ? (
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300">
                            <BookOpen className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="px-2 py-0.5 bg-zinc-100 rounded text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                          {course.category?.name || "Khóa học"}
                        </span>
                        <h4 className="font-bold text-sm text-zinc-800 group-hover:text-[#FF6600] transition-colors truncate mt-1">
                          {course.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-800">Không tìm thấy kết quả</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Thử lại với các từ khóa khác như "AI", "Next.js", "React" hay "DevOps".
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* NOTIFICATIONS SLIDE DRAWER (SHEET) */}
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md rounded-l-[3rem] p-8 flex flex-col h-full overflow-hidden">
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
                      "p-5 rounded-3xl border transition-all relative group flex flex-col gap-2",
                      notif.isRead
                        ? "bg-white border-zinc-100 text-zinc-600"
                        : "bg-orange-50/20 border-orange-100 text-zinc-900 font-medium"
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
    </>
  )
}
