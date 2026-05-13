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
    <div className="group relative h-full flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white dark:bg-zinc-950">
      <Link href={`/courses/${course.slug}`} className="relative aspect-video overflow-hidden shrink-0 block">
        <Image 
          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} 
          alt={course.title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {course.level && course.level !== "ALL" && (
          <Badge className="absolute top-2 left-2 bg-black/70 hover:bg-black/80 backdrop-blur-sm text-white border-none text-[10px]">
            {levelText[course.level]}
          </Badge>
        )}
        {course.price === 0 && (
          <Badge className="absolute top-2 right-2 bg-emerald-500 text-white border-none text-[10px] font-bold">
            FREE
          </Badge>
        )}
      </Link>
      
      <div className="absolute top-2 right-2 z-10">
        <WishlistButton courseId={course.id} />
      </div>

      <div className="p-4 flex flex-col flex-grow gap-2">
        <Link href={`/courses/${course.slug}`} className="hover:text-blue-600 transition-colors">
          <h3 className="font-bold line-clamp-2 text-sm leading-snug">{course.title}</h3>
        </Link>
        <p className="text-xs text-zinc-500 line-clamp-1">{course.instructor?.name}</p>

        <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
          {rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">{rating.toFixed(1)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{totalStudents} học viên</span>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800">
          {isMyCourse ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-zinc-500">
                <span>{progress === 100 ? "Hoàn thành ✓" : "Tiến độ"}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500 rounded-full",
                    progress === 100 ? "bg-emerald-500" : "bg-blue-600"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Link 
                  href={`/learn/${course.slug}`} 
                  className={cn(buttonVariants({ size: "sm", variant: "outline" }), "font-bold rounded-xl h-9 text-[10px]")}
                >
                  Học lại
                </Link>
                {progress === 100 ? (
                  <Button 
                    onClick={handleClaimCertificate}
                    size="sm" 
                    className="font-black rounded-xl h-9 text-[10px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Nhận chứng chỉ
                  </Button>
                ) : (
                   <Link 
                    href={`/learn/${course.slug}`} 
                    className={cn(buttonVariants({ size: "sm" }), "font-bold rounded-xl h-9 text-[10px] bg-blue-600")}
                  >
                    Học tiếp
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="font-black text-base text-blue-600 dark:text-blue-400">
                {formattedPrice}
              </div>
              {course.price > 0 ? (
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex-1 rounded-xl h-9 font-bold text-xs gap-1 border-blue-200 hover:border-blue-400",
                      isInCart && "border-emerald-400 text-emerald-600 bg-emerald-50"
                    )}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {isInCart ? "Trong giỏ" : "Thêm giỏ"}
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    size="sm"
                    className="flex-1 rounded-xl h-9 bg-blue-600 hover:bg-blue-700 font-bold text-xs gap-1"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Mua ngay
                  </Button>
                </div>
              ) : (
                <Link
                  href={`/courses/${course.slug}`}
                  className={cn(buttonVariants({ size: "sm" }), "w-full rounded-xl h-9 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs")}
                >
                  Đăng ký miễn phí
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
