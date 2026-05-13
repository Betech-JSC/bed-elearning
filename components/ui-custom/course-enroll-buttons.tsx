"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Zap, BookOpen } from "lucide-react"
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
      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl font-black text-lg">
        <Link href={`/learn/${course.slug}`}>Vào học ngay →</Link>
      </Button>
    )
  }

  if (course.price === 0) {
    return (
      <Button
        onClick={handleBuyNow}
        className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 rounded-2xl font-black text-lg"
      >
        Đăng ký miễn phí
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleBuyNow}
        className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl font-black text-lg gap-2"
      >
        <Zap className="w-5 h-5" />
        Mua ngay
      </Button>
      <Button
        onClick={handleAddToCart}
        variant="outline"
        className={cn(
          "w-full h-14 rounded-2xl font-black text-lg gap-2 border-2",
          isInCart
            ? "border-emerald-400 text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
            : "border-blue-200 hover:border-blue-400"
        )}
      >
        <ShoppingCart className="w-5 h-5" />
        {isInCart ? "✓ Đã có trong giỏ hàng" : "Thêm vào giỏ hàng"}
      </Button>
      {isInCart && (
        <Button
          asChild
          variant="ghost"
          className="w-full h-10 rounded-xl text-sm text-blue-600 font-bold"
        >
          <Link href="/checkout">Xem giỏ hàng →</Link>
        </Button>
      )}
    </div>
  )
}
