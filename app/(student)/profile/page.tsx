import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { PaymentHistory } from "@/components/dashboard/payment-history"
import { User, ShieldCheck, CreditCard, Award } from "lucide-react"

export default async function ProfilePage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        orderBy: { createdAt: "desc" }
      },
      certificates: {
        include: {
          course: true
        },
        orderBy: { issuedAt: "desc" }
      }
    }
  })

  if (!user) return redirect("/")

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Cài đặt tài khoản</h1>
        <p className="text-zinc-500">Quản lý thông tin cá nhân và xem lịch sử giao dịch của bạn.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <Tabs defaultValue="info" className="flex-1 space-y-8">
          <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 h-12 inline-flex w-full lg:w-auto">
            <TabsTrigger value="info" className="flex-1 lg:flex-none px-8 gap-2">
              <User className="w-4 h-4" />
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 lg:flex-none px-8 gap-2">
              <ShieldCheck className="w-4 h-4" />
              Bảo mật
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex-1 lg:flex-none px-8 gap-2">
              <CreditCard className="w-4 h-4" />
              Lịch sử thanh toán
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex-1 lg:flex-none px-8 gap-2">
              <Award className="w-4 h-4" />
              Chứng chỉ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-0">
            <div className="bg-white dark:bg-zinc-950 border rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Thông tin công khai</h2>
              <ProfileForm user={user} />
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <div className="bg-white dark:bg-zinc-950 border rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Đổi mật khẩu</h2>
              <div className="max-w-2xl space-y-4">
                <p className="text-sm text-zinc-500">
                  Hãy đảm bảo bạn sử dụng một mật khẩu mạnh để bảo vệ tài khoản của mình.
                </p>
                {/* Password form placeholder or real implementation */}
                <div className="p-4 border border-yellow-200 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
                  Tính năng đổi mật khẩu đang được nâng cấp cho tài khoản liên kết Google.
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-0">
            <div className="bg-white dark:bg-zinc-950 border rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Giao dịch gần đây</h2>
              <PaymentHistory orders={user.orders} />
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="mt-0">
            <div className="bg-white dark:bg-zinc-950 border rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Chứng chỉ của tôi</h2>
              {user.certificates.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 border-2 border-dashed rounded-xl">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Bạn chưa đạt được chứng chỉ nào.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.certificates.map(cert => (
                    <div key={cert.id} className="border rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                      <Award className="w-10 h-10 text-blue-600 mb-4" />
                      <h3 className="font-black text-xl text-blue-950 dark:text-blue-100 mb-2">{cert.course.title}</h3>
                      <p className="text-sm text-blue-800/70 dark:text-blue-200/70 mb-4">Mã chứng chỉ: {cert.certificateId}</p>
                      <div className="flex justify-between items-center text-sm font-bold text-blue-600">
                        <span>Cấp ngày: {new Date(cert.issuedAt).toLocaleDateString("vi-VN")}</span>
                        <Button variant="link" className="px-0">Tải về</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
