"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlayCircle, Clock, BarChart, Globe, CheckCircle2, Loader2, ShoppingCart } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/store/use-cart"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface CourseSidebarProps {
  course: {
    id: string
    title: string
    slug: string
    price: number
    thumbnail: string | null
    instructor: {
      name: string | null
    }
  }
  isEnrolled: boolean
  isInstructor: boolean
}

export function CourseSidebar({ course, isEnrolled, isInstructor }: CourseSidebarProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { addItem, items } = useCart()

  const isInCart = items.some((item) => item.id === course.id)

  const onEnroll = async () => {
    if (course.price > 0) {
      router.push("/checkout")
      return
    }
    // Free course enrollment logic...
    try {
      setIsLoading(true)
      const response = await fetch(`/api/courses/${course.id}/enroll`, {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Đã xảy ra lỗi")
      }

      toast.success("Đăng ký khoá học thành công!")
      router.refresh()
      router.push(`/learn/${course.slug}`)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const onAddToCart = () => {
    if (isInCart) {
      toast.info("Khoá học đã có trong giỏ hàng")
      return
    }

    addItem({
      id: course.id,
      title: course.title,
      slug: course.slug,
      price: course.price,
      thumbnail: course.thumbnail,
      instructorName: course.instructor.name
    })
    toast.success("Đã thêm vào giỏ hàng")
  }

  const priceFormatted = course.price === 0 
    ? "Miễn phí" 
    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)

  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-xl shadow-xl overflow-hidden sticky top-24 z-10 transition-all">
      <div className="relative aspect-video group cursor-pointer">
        <Image 
          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} 
          alt={course.title} 
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center group-hover:bg-black/50 transition-colors">
          <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
          <p className="text-white font-bold mt-4 text-lg">Xem thử khóa học</p>
        </div>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="space-y-1">
          <div className="text-4xl font-extrabold text-zinc-900 dark:text-white">
            {priceFormatted}
          </div>
          {course.price > 0 && (
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="line-through">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price * 1.5)}</span>
              <span className="text-green-600 font-bold">-33%</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {isEnrolled ? (
            <Link href={`/learn/${course.slug}`} className={cn(buttonVariants(), "w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700")}>
              Tiếp tục học
            </Link>
          ) : (
            <>
              <Button 
                onClick={onEnroll}
                disabled={isLoading}
                className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700"
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {course.price === 0 ? "Đăng ký ngay" : "Mua ngay"}
              </Button>
              {course.price > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg font-bold border-zinc-900 dark:border-white"
                  disabled={isLoading}
                  onClick={onAddToCart}
                >
                  {isInCart ? "Đã trong giỏ hàng" : "Thêm vào giỏ"}
                </Button>
              )}
            </>
          )}
          
          {isInstructor && (
            <Link href={`/instructor/courses/${course.id}/edit`} className={cn(buttonVariants({ variant: "secondary" }), "w-full h-12 text-lg font-bold")}>
              Chỉnh sửa khóa học
            </Link>
          )}
        </div>

        <div className="text-xs text-center text-zinc-500">
          Cam kết hoàn tiền trong 30 ngày nếu không hài lòng
        </div>

        <Separator />

        <div className="space-y-4">
          <p className="font-bold text-sm">Khóa học này bao gồm:</p>
          <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            <li className="flex gap-3 items-center">
              <Clock className="w-4 h-4" />
              <span>12 giờ video theo yêu cầu</span>
            </li>
            <li className="flex gap-3 items-center">
              <BarChart className="w-4 h-4" />
              <span>Quyền truy cập đầy đủ, trọn đời</span>
            </li>
            <li className="flex gap-3 items-center">
              <Globe className="w-4 h-4" />
              <span>Truy cập trên thiết bị di động và TV</span>
            </li>
            <li className="flex gap-3 items-center">
              <CheckCircle2 className="w-4 h-4" />
              <span>Giấy chứng nhận hoàn thành</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
