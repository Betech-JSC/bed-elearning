import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Award, Printer, ShieldCheck, Calendar, BookOpen, User, ArrowLeft, Globe } from "lucide-react"

interface CertificatePageProps {
  params: Promise<{ certificateId: string }>
}

export async function generateMetadata({ params }: CertificatePageProps) {
  const { certificateId } = await params
  const certificate = await prisma.certificate.findUnique({
    where: { certificateId },
    include: {
      course: true,
      user: true
    }
  })

  if (!certificate) {
    return {
      title: "Không tìm thấy chứng chỉ | Belearning"
    }
  }

  return {
    title: `Chứng chỉ tốt nghiệp của ${certificate.user.name || "Học viên"} - ${certificate.course.title} | Belearning`,
    description: `Xác thực chứng nhận tốt nghiệp chính thức được cấp bởi Belearning cho học viên ${certificate.user.name} sau khi hoàn thành xuất sắc khóa học ${certificate.course.title}.`,
    openGraph: {
      title: `Chứng chỉ tốt nghiệp Belearning - ${certificate.user.name}`,
      description: `Hoàn thành khóa học: ${certificate.course.title}`,
      type: "website"
    }
  }
}

export default async function CertificateDetailPage({ params }: CertificatePageProps) {
  const { certificateId } = await params

  const certificate = await prisma.certificate.findUnique({
    where: { certificateId },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      course: {
        select: {
          title: true,
          description: true,
          instructor: {
            select: {
              name: true,
              bio: true
            }
          }
        }
      }
    }
  })

  if (!certificate) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 border border-zinc-100 shadow-xl shadow-zinc-200/50 text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100 shadow-inner">
            <Award className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900">Không tìm thấy chứng chỉ</h1>
          <p className="text-zinc-500 font-medium text-sm leading-relaxed">
            Mã xác thực chứng chỉ không hợp lệ hoặc đã bị gỡ bỏ khỏi hệ thống Belearning. Vui lòng kiểm tra lại.
          </p>
          <div className="pt-4">
            <Button asChild className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-[#FF6600] text-white font-black text-xs uppercase tracking-widest gap-2">
              <Link href="/certifications">
                <ArrowLeft className="w-4 h-4" />
                Về trang xác minh
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })

  // Dynamic QR Code link to current page for physical verification
  const verificationUrl = `https://elearning.betech.vn/certifications/${certificateId}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}&color=000000`

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 pt-28 px-4 sm:px-6">
      {/* Google Fonts Import for Royal Certificate Style Typography */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Dancing+Script:wght@700&family=Playfair+Display:ital,wght@0,600;0,800;1,500&display=swap" 
        rel="stylesheet" 
      />

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* TOP INTERACTIVE ACTIONS (Hidden during printing) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500 border border-emerald-100/30 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block">Xác thực hệ thống</span>
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Chứng chỉ này là chính thức và có hiệu lực trực tuyến</span>
            </div>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <Button asChild variant="outline" className="rounded-xl h-12 border-zinc-200 dark:border-zinc-800 font-bold text-xs gap-2 flex-1 sm:flex-none">
              <Link href="/certificates">
                <ArrowLeft className="w-4 h-4" />
                Về danh sách
              </Link>
            </Button>
            
            {/* Interactive JS Print button */}
            <Button 
              onClick={() => window.print()}
              className="rounded-xl h-12 bg-[#FF6600] hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-orange-500/10 active:scale-95 transition-all flex-1 sm:flex-none"
            >
              <Printer className="w-4 h-4" />
              In / Tải PDF
            </Button>
          </div>
        </div>

        {/* ==================== CERTIFICATE BOARD (PRINTABLE CONTAINER) ==================== */}
        <div 
          id="printable-certificate-container"
          className="relative bg-white dark:bg-zinc-900 border-[16px] border-double border-orange-200 dark:border-zinc-800/80 p-8 sm:p-14 md:p-20 shadow-2xl rounded-[3rem] overflow-hidden text-center aspect-[1.414/1] flex flex-col justify-between"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,102,0,0.01) 0%, rgba(255,255,255,0) 70%)"
          }}
        >
          {/* Elegant Vintage Background Borders */}
          <div className="absolute inset-4 border-2 border-orange-100/50 dark:border-zinc-800 rounded-[2rem] pointer-events-none -z-0" />
          <div className="absolute top-8 left-8 w-24 h-24 border-t-4 border-l-4 border-orange-300 dark:border-zinc-700 rounded-tl-3xl pointer-events-none -z-0" />
          <div className="absolute top-8 right-8 w-24 h-24 border-t-4 border-r-4 border-orange-300 dark:border-zinc-700 rounded-tr-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-8 left-8 w-24 h-24 border-b-4 border-l-4 border-orange-300 dark:border-zinc-700 rounded-bl-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-8 right-8 w-24 h-24 border-b-4 border-r-4 border-orange-300 dark:border-zinc-700 rounded-br-3xl pointer-events-none -z-0" />

          {/* 1. HEADER LOGO & ID */}
          <div className="relative z-10 flex justify-between items-start">
            <div className="text-left">
              <span className="font-['Cinzel'] font-black tracking-widest text-[#FF6600] text-lg sm:text-xl uppercase">Belearning</span>
              <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 block mt-0.5">Vững bước sự nghiệp số</span>
            </div>
            
            <div className="text-right">
              <span className="text-[7px] sm:text-[9px] font-bold text-zinc-400 block uppercase tracking-widest mb-0.5">Mã số chứng chỉ</span>
              <span className="text-[8px] sm:text-[10px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100/60 dark:bg-zinc-800 px-2.5 py-1 rounded">
                #{certificateId.toUpperCase()}
              </span>
            </div>
          </div>

          {/* 2. CERTIFICATE CONTENT BODY */}
          <div className="relative z-10 py-4 sm:py-6 space-y-5 sm:space-y-7 my-auto">
            <h2 className="font-['Cinzel'] font-bold text-orange-950 dark:text-zinc-100 text-3xl sm:text-4xl md:text-5xl tracking-widest">
              CHỨNG CHỈ TỐT NGHIỆP
            </h2>
            
            <p className="font-['Playfair_Display'] italic text-zinc-500 dark:text-zinc-400 text-sm sm:text-base md:text-lg">
              Học viện Đào tạo Trực tuyến Belearning trân trọng chứng nhận
            </p>

            <div className="space-y-2">
              <h3 className="font-['Playfair_Display'] font-extrabold text-zinc-900 dark:text-white text-3xl sm:text-4xl md:text-5xl border-b-2 border-orange-100 dark:border-zinc-800 pb-3 inline-block px-12 tracking-wide leading-tight">
                {certificate.user.name || "Học viên xuất sắc"}
              </h3>
              <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pt-1">
                Đã hoàn thành xuất sắc yêu cầu đào tạo của chương trình học
              </p>
            </div>

            <div className="space-y-2 max-w-2xl mx-auto">
              <h4 className="font-['Cinzel'] font-extrabold text-[#FF6600] text-xl sm:text-2xl md:text-3xl leading-snug tracking-wide">
                {certificate.course.title}
              </h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-xs font-semibold leading-relaxed max-w-lg mx-auto line-clamp-2 italic">
                "{certificate.course.description || "Khóa học đào tạo chuyên môn chuyên sâu trên nền tảng Belearning."}"
              </p>
            </div>
          </div>

          {/* 3. SIGNATURES & VERIFICATION FOOTER */}
          <div className="relative z-10 grid grid-cols-3 gap-4 items-end pt-4 sm:pt-6 border-t border-orange-50 dark:border-zinc-800/80">
            {/* Left: Issued Date */}
            <div className="text-left space-y-1.5 shrink-0">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest">Ngày cấp chứng nhận</span>
              </div>
              <span className="text-[10px] sm:text-sm font-black text-zinc-800 dark:text-zinc-200 block pl-5">
                {formattedDate}
              </span>
            </div>

            {/* Middle: Golden Seal or QR code */}
            <div className="flex flex-col items-center justify-center relative">
              {/* Golden Wax Seal Mock SVG */}
              <div className="w-14 sm:w-20 h-14 sm:h-20 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg relative border-4 border-white/90 ring-4 ring-amber-500/20 group">
                <div className="absolute inset-1.5 border border-white/40 rounded-full border-dashed" />
                <Award className="w-6 sm:w-10 h-6 sm:h-10 text-white drop-shadow-md" />
                <div className="absolute text-[5px] sm:text-[6px] font-black text-amber-950 uppercase tracking-widest animate-in fade-in zoom-in duration-500">
                  BELEARNING
                </div>
              </div>
              <span className="text-[6px] sm:text-[8px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 mt-2">
                Học viện số Betech
              </span>
            </div>

            {/* Right: Signature */}
            <div className="text-right space-y-1.5">
              <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400 block">Giám đốc học viện ký họa</span>
              <div className="h-10 sm:h-14 flex items-center justify-end relative">
                {/* Simulated signature with handwriting font */}
                <span className="font-['Dancing_Script'] text-2xl sm:text-3xl text-zinc-800 dark:text-zinc-200 tracking-wider rotate-[-5deg] block mr-4">
                  Toàn Nguyễn
                </span>
                {/* Decorative Signature Line */}
                <div className="absolute bottom-0 right-0 w-24 sm:w-36 h-px bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <span className="text-[9px] sm:text-xs font-black text-zinc-800 dark:text-zinc-200 block pr-2">
                Nguyễn Công Toàn
              </span>
            </div>
          </div>

          {/* Dynamic Interactive QR code floating for print verification */}
          <div className="absolute bottom-10 left-10 hidden print:flex flex-col items-center gap-1 border p-1 bg-white rounded-lg">
            <img src={qrCodeUrl} alt="QR Verification" className="w-12 h-12" />
            <span className="text-[5px] font-bold text-zinc-400 uppercase">Quét xác thực</span>
          </div>
        </div>

        {/* PRINT CSS STYLING OVERRIDES */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body {
              background-color: white !important;
              color: black !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .print\\:hidden, header, footer, nav, button {
              display: none !important;
            }
            #printable-certificate-container {
              border: 12px double #FF6600 !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              width: 100% !important;
              height: 100vh !important;
              max-width: none !important;
              max-height: none !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
              background-color: white !important;
            }
            @page {
              size: landscape;
              margin: 0;
            }
          }
        `}} />
      </div>
    </div>
  )
}
