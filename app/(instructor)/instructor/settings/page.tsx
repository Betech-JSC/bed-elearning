import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"
import { Settings, User, ShieldCheck, HelpCircle, Wallet, BookOpen } from "lucide-react"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getInstructorBalance } from "@/lib/revenue"
import { PayoutClient } from "../payouts/_components/payout-client"

export const dynamic = "force-dynamic"

export default async function InstructorSettingsPage() {
  const session = await auth()
  if (!session?.user?.id) return redirect("/login")
  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    return redirect("/")
  }

  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      courses: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          price: true
        }
      }
    }
  })

  if (!user) return redirect("/")

  // Map courses to searchable format
  const coursesForSearch = user.courses.map(c => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    thumbnail: c.thumbnail,
    price: c.price,
    salePrice: c.price,
    category: null
  }))

  // Fetch notifications
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  })

  // Fetch payout data
  const {
    totalRevenue,
    totalPaidOut,
    totalPending,
    availableBalance
  } = await getInstructorBalance(userId)

  const payouts = await prisma.payout.findMany({
    where: { instructorId: userId },
    orderBy: { createdAt: "desc" }
  })

  const lastBankInfo = payouts.find(p => p.bankInfo && p.bankInfo.trim().length > 0)?.bankInfo || ""

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      {/* 1. Header with integrated notifications & search */}
      <DashboardHeader 
        userName={user.name || "Giảng viên"}
        courses={coursesForSearch}
        initialNotifications={notifications}
        title={
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
            <span className="bg-orange-500 text-white p-2 rounded-2xl">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </span>
            Cài đặt Tài khoản
          </h1>
        }
        subtitle="Quản lý hồ sơ giảng viên cá nhân và cấu hình tài khoản bảo mật của bạn."
      />

      {/* 2. Main Tabs Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        <Tabs defaultValue="info" className="flex-1 space-y-6">
          <TabsList className="bg-transparent p-0 !h-auto w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <TabsTrigger 
              value="info" 
              className="h-24 px-6 rounded-[2rem] border border-zinc-100 bg-white data-[state=active]:bg-[#FF6600] data-[state=active]:text-white data-[state=active]:border-[#FF6600] text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center justify-start gap-4 transition-all shadow-sm hover:shadow-md data-[state=active]:shadow-xl data-[state=active]:shadow-orange-500/20 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white flex items-center justify-center transition-colors shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left flex flex-col gap-0.5">
                <span>Thông tin</span>
                <span className="text-[10px] font-bold text-zinc-400 group-data-[state=active]:text-white/70 tracking-normal normal-case">Hồ sơ cá nhân</span>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="payout_info" 
              className="h-24 px-6 rounded-[2rem] border border-zinc-100 bg-white data-[state=active]:bg-[#FF6600] data-[state=active]:text-white data-[state=active]:border-[#FF6600] text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center justify-start gap-4 transition-all shadow-sm hover:shadow-md data-[state=active]:shadow-xl data-[state=active]:shadow-orange-500/20 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white flex items-center justify-center transition-colors shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="text-left flex flex-col gap-0.5">
                <span>Thanh toán</span>
                <span className="text-[10px] font-bold text-zinc-400 group-data-[state=active]:text-white/70 tracking-normal normal-case">Tài khoản rút tiền</span>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="guides" 
              className="h-24 px-6 rounded-[2rem] border border-zinc-100 bg-white data-[state=active]:bg-[#FF6600] data-[state=active]:text-white data-[state=active]:border-[#FF6600] text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center justify-start gap-4 transition-all shadow-sm hover:shadow-md data-[state=active]:shadow-xl data-[state=active]:shadow-orange-500/20 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white flex items-center justify-center transition-colors shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left flex flex-col gap-0.5">
                <span>Giảng dạy</span>
                <span className="text-[10px] font-bold text-zinc-400 group-data-[state=active]:text-white/70 tracking-normal normal-case">Tài liệu hướng dẫn</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Profile Info */}
          <TabsContent value="info" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-white border border-zinc-50 rounded-[2.5rem] p-10 shadow-sm space-y-8">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 mb-2 flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-[#FF6600] rounded-full" />
                  Hồ sơ Cá nhân
                </h2>
                <p className="text-xs text-zinc-400 font-medium">Cập nhật thông tin công khai của bạn. Thông tin này sẽ hiển thị trên trang giảng viên của bạn.</p>
              </div>
              <ProfileForm user={user} />
            </div>
          </TabsContent>

          {/* Tab 2: Payout Accounts Info */}
          <TabsContent value="payout_info" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-[#F8F9FA] dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-10 shadow-sm space-y-8">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-2 flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
                  Quản lý Doanh thu & Rút tiền
                </h2>
                <p className="text-xs text-zinc-500 font-medium max-w-3xl">Tất cả các giao dịch thanh toán sẽ được thực hiện thông qua hệ thống bảo mật nội bộ. Bạn có thể theo dõi số dư và lên lệnh rút tiền trực tiếp ngay tại đây.</p>
              </div>

              <PayoutClient 
                totalRevenue={totalRevenue}
                availableBalance={availableBalance}
                totalPaidOut={totalPaidOut}
                payouts={payouts}
                lastBankInfo={lastBankInfo}
              />
            </div>
          </TabsContent>

          {/* Tab 3: Teaching guides */}
          <TabsContent value="guides" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-white border border-zinc-50 rounded-[2.5rem] p-10 shadow-sm space-y-8">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 mb-2 flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-purple-500 rounded-full" />
                  Tài liệu & Hướng dẫn Giảng dạy
                </h2>
                <p className="text-xs text-zinc-400 font-medium">Khám phá các tiêu chuẩn tạo nội dung bài giảng chất lượng cao trên Belearning.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <div className="border border-zinc-100 rounded-[2rem] p-8 hover:shadow-xl hover:shadow-orange-500/5 transition-all group bg-[#F8F9FA]">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#FF6600] border border-orange-50 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-zinc-900 mb-2">Tiêu chuẩn quay Video bài giảng</h3>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                    Hướng dẫn chi tiết về cấu hình âm thanh, độ phân giải tối thiểu 1080p, tỷ lệ khung hình 16:9 và bố cục giảng dạy chuyên nghiệp.
                  </p>
                </div>

                <div className="border border-zinc-100 rounded-[2rem] p-8 hover:shadow-xl hover:shadow-orange-500/5 transition-all group bg-[#F8F9FA]">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 border border-blue-50 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-zinc-900 mb-2">Quy tắc Ứng xử & Bản quyền</h3>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                    Đảm bảo toàn bộ nội dung khóa học thuộc quyền sở hữu trí tuệ hợp pháp của bạn và tuân thủ thuần phong mỹ tục giảng dạy.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
