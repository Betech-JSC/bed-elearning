import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
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
    <div className="max-w-7xl mx-auto px-10 py-20 bg-[#F8F9FA] rounded-[3rem] my-10 border border-zinc-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6600] border border-orange-100 shadow-sm">
                <User className="w-6 h-6" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF6600]">Account Control</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-zinc-900">Cài đặt <span className="text-[#FF6600]">Tài khoản</span></h1>
          <p className="text-zinc-500 font-medium text-lg">Quản lý thông tin cá nhân và xem lịch sử giao dịch của bạn.</p>
        </div>
        {(session?.user?.role === "ADMIN" || session?.user?.role === "INSTRUCTOR") && (
          <Button asChild variant="outline" className="h-14 rounded-2xl px-8 border-zinc-200 font-black text-xs uppercase tracking-widest gap-3 hover:bg-white hover:text-[#FF6600] hover:border-orange-100 transition-all shadow-sm">
            <Link href={session?.user?.role === "ADMIN" ? "/admin/dashboard" : "/instructor/dashboard"}>
               Dashboard
               <Award className="w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        <Tabs defaultValue="info" className="flex-1 space-y-12">
          <TabsList className="bg-transparent p-0 h-auto w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
            <TabsTrigger 
              value="info" 
              className="h-24 px-6 rounded-[2rem] border border-zinc-100 bg-white data-[state=active]:bg-[#FF6600] data-[state=active]:text-white data-[state=active]:border-[#FF6600] text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center justify-start gap-4 transition-all shadow-sm hover:shadow-md data-[state=active]:shadow-xl data-[state=active]:shadow-orange-500/20 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white flex items-center justify-center transition-colors shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left flex flex-col gap-0.5">
                <span>Thông tin</span>
                <span className="text-[10px] font-bold text-zinc-400 group-data-[state=active]:text-white/70 tracking-normal normal-case">Cá nhân</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="h-24 px-6 rounded-[2rem] border border-zinc-100 bg-white data-[state=active]:bg-[#FF6600] data-[state=active]:text-white data-[state=active]:border-[#FF6600] text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center justify-start gap-4 transition-all shadow-sm hover:shadow-md data-[state=active]:shadow-xl data-[state=active]:shadow-orange-500/20 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white flex items-center justify-center transition-colors shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left flex flex-col gap-0.5">
                <span>Bảo mật</span>
                <span className="text-[10px] font-bold text-zinc-400 group-data-[state=active]:text-white/70 tracking-normal normal-case">Tài khoản</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="h-24 px-6 rounded-[2rem] border border-zinc-100 bg-white data-[state=active]:bg-[#FF6600] data-[state=active]:text-white data-[state=active]:border-[#FF6600] text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center justify-start gap-4 transition-all shadow-sm hover:shadow-md data-[state=active]:shadow-xl data-[state=active]:shadow-orange-500/20 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white flex items-center justify-center transition-colors shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="text-left flex flex-col gap-0.5">
                <span>Thanh toán</span>
                <span className="text-[10px] font-bold text-zinc-400 group-data-[state=active]:text-white/70 tracking-normal normal-case">Lịch sử</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="certificates" 
              className="h-24 px-6 rounded-[2rem] border border-zinc-100 bg-white data-[state=active]:bg-[#FF6600] data-[state=active]:text-white data-[state=active]:border-[#FF6600] text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center justify-start gap-4 transition-all shadow-sm hover:shadow-md data-[state=active]:shadow-xl data-[state=active]:shadow-orange-500/20 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white flex items-center justify-center transition-colors shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-left flex flex-col gap-0.5">
                <span>Chứng chỉ</span>
                <span className="text-[10px] font-bold text-zinc-400 group-data-[state=active]:text-white/70 tracking-normal normal-case">Hoàn thành</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-white border border-zinc-50 rounded-[2.5rem] p-12 shadow-sm">
              <h2 className="text-2xl font-black text-zinc-900 mb-10 flex items-center gap-4">
                 <div className="w-1.5 h-8 bg-[#FF6600] rounded-full" />
                 Thông tin cá nhân
              </h2>
              <ProfileForm user={user} />
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-white border border-zinc-50 rounded-[2.5rem] p-12 shadow-sm">
              <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-4">
                 <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
                 Đổi mật khẩu
              </h2>
              <div className="max-w-2xl space-y-8">
                <p className="text-zinc-500 font-medium leading-relaxed">
                  Hãy đảm bảo bạn sử dụng một mật khẩu mạnh để bảo vệ tài khoản của mình. Mật khẩu nên chứa ít nhất 8 ký tự, bao gồm chữ cái và số.
                </p>
                <div className="p-8 border border-orange-100 bg-orange-50/50 text-[#FF6600] rounded-[2rem] text-sm font-bold flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-black uppercase tracking-widest text-[10px]">Google Connected</span>
                    Tính năng đổi mật khẩu đang được nâng cấp cho tài khoản liên kết Google.
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-white border border-zinc-50 rounded-[2.5rem] p-12 shadow-sm">
              <h2 className="text-2xl font-black text-zinc-900 mb-10 flex items-center gap-4">
                 <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                 Lịch sử giao dịch
              </h2>
              <PaymentHistory orders={user.orders} />
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-white border border-zinc-50 rounded-[2.5rem] p-12 shadow-sm">
              <h2 className="text-2xl font-black text-zinc-900 mb-10 flex items-center gap-4">
                 <div className="w-1.5 h-8 bg-purple-500 rounded-full" />
                 Chứng chỉ hoàn thành
              </h2>
              {user.certificates.length === 0 ? (
                <div className="text-center py-24 text-zinc-400 bg-[#F8F9FA] rounded-[3rem] border-2 border-dashed border-zinc-100 flex flex-col items-center gap-6">
                  <Award className="w-16 h-16 opacity-10" />
                  <p className="font-black uppercase tracking-[0.2em] text-[10px]">Chưa có chứng chỉ</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {user.certificates.map(cert => (
                    <div key={cert.id} className="border border-zinc-50 rounded-[2.5rem] p-10 bg-[#F8F9FA] relative overflow-hidden group hover:shadow-xl hover:shadow-purple-500/5 transition-all">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-100/50 rounded-bl-full -z-0 group-hover:scale-125 transition-transform duration-700" />
                      <div className="relative z-10 space-y-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm border border-purple-50">
                            <Award className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="font-black text-2xl text-zinc-900 mb-2 leading-tight">{cert.course.title}</h3>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">ID: {cert.certificateId}</p>
                        </div>
                        <div className="flex flex-col gap-4 pt-4 border-t border-zinc-100">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Issued Date</span>
                                <span className="text-xs font-black text-zinc-900">{new Date(cert.issuedAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                            <Button className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-purple-500/20">
                                Download Certificate
                            </Button>
                        </div>
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
