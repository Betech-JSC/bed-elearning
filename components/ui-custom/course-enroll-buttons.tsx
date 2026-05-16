"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Zap, BookOpen, ArrowRight } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CourseEnrollButtonsProps {
  course: {
    id: string
    title: string
    price: number
    thumbnail: string | null
    slug: string
    instructor: { name: string | null }
  }
  isEnrolled: boolean
}

export function CourseEnrollButtons({ course, isEnrolled }: CourseEnrollButtonsProps) {
  const { addItem, items } = useCart()
  const router = useRouter()

  const isInCart = items.some(item => item.id === course.id)

  const handleAddToCart = () => {
    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      thumbnail: course.thumbnail,
      instructorName: course.instructor.name || "",
    })
  }

  const handleBuyNow = () => {
    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      thumbnail: course.thumbnail,
      instructorName: course.instructor.name || "",
    })
    router.push("/checkout")
  }

  if (isEnrolled) {
    return (
      <Button asChild className="w-full bg-[#FF6600] hover:bg-orange-600 h-16 rounded-[2rem] font-black text-xs uppercase tracking-widest text-white border-none shadow-xl shadow-orange-500/20">
        <Link href={`/learn/${course.slug}`} className="flex items-center justify-center gap-2">
            Vào học ngay
            <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    )
  }

  if (course.price === 0) {
    return (
      <Button
        onClick={handleBuyNow}
        className="w-full bg-emerald-600 hover:bg-emerald-700 h-16 rounded-[2rem] font-black text-xs uppercase tracking-widest text-white border-none shadow-xl shadow-emerald-500/20"
      >
        Đăng ký miễn phí
      </Button>
    )
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleBuyNow}
        className="w-full bg-[#FF6600] hover:bg-orange-600 h-16 rounded-[2rem] font-black text-xs uppercase tracking-widest text-white border-none shadow-xl shadow-orange-500/20 gap-3 transition-all hover:scale-[1.02] active:scale-95"
      >
        <Zap className="w-4 h-4 fill-current" />
        Mua ngay
      </Button>
      <Button
        onClick={handleAddToCart}
        variant="outline"
        className={cn(
          "w-full h-16 rounded-[2rem] font-black text-xs uppercase tracking-widest gap-3 transition-all border-2",
          isInCart
            ? "border-emerald-400 text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
            : "border-zinc-100 hover:border-[#FF6600] hover:bg-orange-50 text-zinc-900"
        )}
      >
        <ShoppingCart className="w-4 h-4" />
        {isInCart ? "Đã trong giỏ hàng" : "Thêm vào giỏ hàng"}
      </Button>
      {isInCart && (
        <Link 
            href="/checkout" 
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FF6600] hover:underline pt-2"
        >
            Tiến hành thanh toán
            <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  )
}
