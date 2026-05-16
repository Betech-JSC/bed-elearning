import Image from "next/image"
import Link from "next/link"
import { Star, Users, BookOpen, Award } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"

async function getInstructors() {
  const instructors = await prisma.user.findMany({
    where: {
      role: "INSTRUCTOR",
      status: "ACTIVE"
    },
    include: {
      courses: {
        where: {
          status: "PUBLISHED"
        },
        include: {
          category: true
        }
      },
      reviews: true
    },
    take: 12
  })

  return instructors.map(instructor => {
    const totalReviews = instructor.reviews.length
    const averageRating = totalReviews > 0 
      ? instructor.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews 
      : 5.0

    // Extract unique category names as expertise
    const expertise = Array.from(new Set(instructor.courses.map(c => c.category?.name).filter(Boolean))).slice(0, 3)

    return {
      id: instructor.id,
      name: instructor.name || "Giảng viên Belearning",
      role: instructor.bio?.substring(0, 50) || "Chuyên gia đào tạo",
      image: instructor.image || `https://i.pravatar.cc/150?u=${instructor.id}`,
      courses: instructor.courses.length,
      students: "1,000+", 
      rating: averageRating.toFixed(1),
      bio: instructor.bio || "Đội ngũ giảng viên tâm huyết tại Belearning.",
      expertise: expertise.length > 0 ? expertise : ["Giảng dạy", "Chuyên gia"]
    }
  })
}

export default async function InstructorsPage() {
  const instructors = await getInstructors()

  return (
    <div className="bg-[#F8F9FA] pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-8 mb-24 animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100/50 border border-orange-200 rounded-full">
                <Award className="w-3.5 h-3.5 text-[#FF6600]" />
                <span className="text-[10px] font-black text-[#FF6600] uppercase tracking-widest">Đội ngũ giảng viên</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-tight text-zinc-900">
                Học từ những <br/>
                <span className="text-[#FF6600]">người giỏi nhất.</span>
            </h1>
            <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                Kết nối với những chuyên gia hàng đầu đang trực tiếp giảng dạy tại Belearning.
            </p>
        </div>

        {/* Instructor Grid */}
        {instructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-32">
              {instructors.map((instructor) => (
                  <div key={instructor.id} className="group bg-white rounded-[3.5rem] p-10 border border-zinc-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-8">
                          <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500 bg-zinc-100">
                              <Image 
                                  src={instructor.image} 
                                  alt={instructor.name} 
                                  fill 
                                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                  sizes="96px"
                              />
                          </div>
                          <div className="bg-orange-50 px-4 py-2 rounded-2xl flex items-center gap-2 shrink-0">
                              <Star className="w-4 h-4 text-[#FF6600] fill-[#FF6600]" />
                              <span className="text-sm font-black text-[#FF6600]">{instructor.rating}</span>
                          </div>
                      </div>

                      <div className="space-y-6 flex-grow flex flex-col">
                          <div>
                              <h3 className="text-2xl font-black text-zinc-900 mb-1 line-clamp-1">{instructor.name}</h3>
                              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 line-clamp-1">{instructor.role}</p>
                          </div>

                          <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-3">
                              {instructor.bio}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-auto">
                              {instructor.expertise.map((exp, j) => (
                                  <span key={j} className="px-4 py-1.5 bg-zinc-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover:bg-orange-50 group-hover:text-[#FF6600] transition-colors">
                                      {exp}
                                  </span>
                              ))}
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-50">
                              <div className="flex items-center gap-3">
                                  <BookOpen className="w-4 h-4 text-zinc-300" />
                                  <span className="text-xs font-black text-zinc-900">{instructor.courses} Khóa học</span>
                              </div>
                              <div className="flex items-center gap-3">
                                  <Users className="w-4 h-4 text-zinc-300" />
                                  <span className="text-xs font-black text-zinc-900">{instructor.students} Học viên</span>
                              </div>
                          </div>

                          <Button asChild className="w-full h-14 rounded-2xl bg-[#F1F3F5] group-hover:bg-[#FF6600] group-hover:text-white transition-all font-black text-xs uppercase tracking-widest text-zinc-900 mt-2 border-none">
                              <Link href={`/instructors/${instructor.id}`}>Xem hồ sơ đầy đủ</Link>
                          </Button>
                      </div>
                  </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[4rem] border border-zinc-100 shadow-sm mb-32">
              <p className="text-zinc-500 font-medium">Hiện chưa có giảng viên nào được hiển thị công khai.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-zinc-900 rounded-[4rem] p-16 md:p-24 text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-orange-600/5 pointer-events-none" />
            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Trở thành giảng viên <br/> tại Belearning?</h2>
                <p className="text-zinc-400 font-medium text-lg leading-relaxed">
                    Chia sẻ kiến thức của bạn với hàng chục ngàn học viên và xây dựng thương hiệu cá nhân của riêng mình. Chúng tôi hỗ trợ bạn từ khâu lên giáo trình đến sản xuất video.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                    <Button asChild size="lg" className="h-16 px-10 rounded-full bg-[#FF6600] hover:bg-orange-600 font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20">
                        <Link href="/instructor-application">Bắt đầu ứng tuyển ngay</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="h-16 px-10 rounded-full border-zinc-700 bg-transparent text-white hover:bg-zinc-800 font-black text-sm uppercase tracking-widest transition-all">
                        Tìm hiểu thêm
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
