import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Award, Download, Search } from "lucide-react"

export default async function CertificatesPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return redirect("/login")
  }

  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          title: true,
          thumbnail: true,
          instructor: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: { issuedAt: "desc" }
  })

  return (
    <div className="relative space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">Chứng chỉ của tôi</h1>
          <p className="text-zinc-500 font-medium">Theo dõi và tải về các chứng chỉ tốt nghiệp từ các khóa học của bạn.</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-[#FF6600] transition-colors" />
          <Input 
            placeholder="Tìm kiếm chứng chỉ..." 
            className="pl-12 h-14 rounded-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm text-sm font-medium focus-visible:ring-[#FF6600]/20 focus-visible:border-[#FF6600] transition-all" 
          />
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-zinc-100 rounded-[3rem] bg-zinc-50/50">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-8 border border-zinc-50">
            <Award className="w-12 h-12 text-zinc-300" />
          </div>
          <h3 className="text-2xl font-black mb-3 text-zinc-900">Chưa có chứng chỉ nào</h3>
          <p className="text-zinc-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">Hoàn thành 100% nội dung của bất kỳ khoá học nào để nhận được chứng chỉ tốt nghiệp từ Belearning.</p>
          <a 
            href="/my-courses" 
            className="bg-[#FF6600] hover:bg-orange-600 text-white font-black text-sm uppercase tracking-widest py-4 px-10 rounded-2xl transition-all shadow-xl shadow-orange-500/20 inline-block"
          >
            Tiếp tục học
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-bl-full -z-0 opacity-50 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner border border-purple-100/50">
                    <Award className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">ID Chứng chỉ</p>
                    <p className="text-[10px] font-bold text-zinc-900 bg-zinc-100 px-3 py-1.5 rounded-lg inline-block">#{cert.certificateId.substring(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex-1 mb-8">
                  <h3 className="font-black text-2xl text-zinc-900 mb-6 leading-tight group-hover:text-[#FF6600] transition-colors line-clamp-3">
                    {cert.course.title}
                  </h3>
                  <div className="space-y-3 border-l-2 border-zinc-100 pl-4">
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Giảng viên</p>
                      <p className="text-sm font-bold text-zinc-700">{cert.course.instructor?.name || "Giảng viên"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Ngày cấp</p>
                      <p className="text-sm font-bold text-zinc-700">{new Date(cert.issuedAt).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 group-hover:bg-[#FF6600] transition-colors shadow-lg">
                  <Download className="w-4 h-4" />
                  Tải chứng chỉ
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
