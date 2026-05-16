"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Star, Users, ShoppingCart, Zap, Award } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import { WishlistButton } from "@/components/course/wishlist-button"
import { toast } from "sonner"

import { useSession } from "next-auth/react"

interface CourseCardProps {
  course: any
  rating?: number
  totalStudents?: number
  isMyCourse?: boolean
  progress?: number
}

export function CourseCard({ course, rating = 0, totalStudents = 0, isMyCourse, progress = 0 }: CourseCardProps) {
  const { addItem, items } = useCart()
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const formattedPrice = course.price === 0 
    ? "Miễn phí" 
    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)

  const levelText: Record<string, string> = {
    BEGINNER: "Cơ bản",
    INTERMEDIATE: "Trung cấp",
    ADVANCED: "Nâng cao",
    ALL: "Mọi cấp độ"
  }

  const isInCart = items.some(item => item.id === course.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (status === "unauthenticated") {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng")
      return router.push("/login")
    }

    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      thumbnail: course.thumbnail,
      instructorName: course.instructor?.name || "",
    })
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (status === "unauthenticated") {
      toast.error("Vui lòng đăng nhập để mua khóa học")
      return router.push("/login")
    }

    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      thumbnail: course.thumbnail,
      instructorName: course.instructor?.name || "",
    })
    router.push("/checkout")
  }

  const handleClaimCertificate = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await fetch(`/api/courses/${course.id}/certificates`, {
        method: "POST"
      })
      if (!res.ok) throw new Error()
      toast.success("Đã cấp chứng chỉ thành công! Bạn có thể xem trong Profile.")
      router.push("/profile")
    } catch {
      toast.error("Không thể cấp chứng chỉ vào lúc này.")
    }
  }

  return (
    <div className="group relative h-full flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500">
      <Link href={`/courses/${course.slug}`} className="relative aspect-[16/10] overflow-hidden block">
        <Image 
          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} 
          alt={course.title} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-[#FF6600] text-white border-none font-black px-3 py-1.5 rounded-xl shadow-lg">
            {formattedPrice}
          </Badge>
        </div>

        {/* Level Badge */}
        {course.level && course.level !== "ALL" && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 dark:bg-black/70 backdrop-blur-md border-none text-[10px] font-bold">
              {levelText[course.level]}
            </Badge>
          </div>
        )}
      </Link>
      
      <div className="absolute top-[40%] right-4 z-10 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <WishlistButton courseId={course.id} />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-lg">
                <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                <span className="text-[10px] font-black text-orange-700 dark:text-orange-400">{rating > 0 ? rating.toFixed(1) : "5.0"}</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium">(2.3k reviews)</span>
        </div>

        <Link href={`/courses/${course.slug}`} className="hover:text-[#FF6600] transition-colors mb-2">
          <h3 className="font-black text-base leading-tight line-clamp-2">{course.title}</h3>
        </Link>
        
        <p className="text-xs text-zinc-400 font-medium mb-4">Giảng viên: <span className="text-zinc-600 dark:text-zinc-300">{course.instructor?.name || "Expert"}</span></p>

        <div className="mt-auto">
          {isMyCourse ? (
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                <span>{progress === 100 ? "HOÀN THÀNH ✓" : "TIẾN ĐỘ HỌC TẬP"}</span>
                <span className="text-[#FF6600]">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-700 rounded-full",
                    progress === 100 ? "bg-emerald-500" : "bg-[#FF6600]"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex gap-2 pt-1">
                {progress === 100 ? (
                  <Button 
                    onClick={handleClaimCertificate}
                    className="w-full font-black rounded-2xl bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/20 gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Nhận chứng chỉ
                  </Button>
                ) : (
                   <Button asChild className="w-full font-black rounded-2xl bg-[#FF6600] hover:bg-orange-600 shadow-lg shadow-orange-500/20">
                    <Link href={`/learn/${course.slug}`}>Học tiếp</Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
               <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5 text-zinc-400">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold">{totalStudents}</span>
                     </div>
                     <div className="flex items-center gap-1.5 text-zinc-400">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold">12h</span>
                     </div>
                  </div>
                  <div className="flex gap-2">
                      <Button
                        onClick={handleAddToCart}
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "rounded-xl h-9 w-9 text-zinc-400 hover:text-[#FF6600] hover:bg-orange-50 transition-all",
                          isInCart && "text-orange-600 bg-orange-50"
                        )}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleBuyNow}
                        size="sm"
                        className="rounded-xl px-4 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 font-bold text-[11px]"
                      >
                        Đăng ký
                      </Button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
