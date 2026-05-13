"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface WishlistButtonProps {
  courseId: string
  initialIsWishlisted?: boolean
}

export const WishlistButton = ({
  courseId,
  initialIsWishlisted = false
}: WishlistButtonProps) => {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/wishlist/status`)
        if (res.ok) {
          const data = await res.json()
          setIsWishlisted(data.isWishlisted)
        }
      } catch (error) {
        console.error("Failed to fetch wishlist status")
      }
    }
    
    if (initialIsWishlisted === false) {
      fetchStatus()
    }
  }, [courseId, initialIsWishlisted])

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      setIsLoading(true)
      const res = await fetch(`/api/courses/${courseId}/wishlist`, {
        method: "POST"
      })

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Vui lòng đăng nhập để lưu khóa học")
          return router.push("/login")
        }
        throw new Error("Lỗi mạng")
      }

      const data = await res.json()
      setIsWishlisted(data.isWishlisted)

      if (data.isWishlisted) {
        toast.success("Đã thêm vào danh sách yêu thích")
      } else {
        toast.success("Đã xóa khỏi danh sách yêu thích")
      }

      router.refresh()
    } catch {
      toast.error("Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) return null

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      variant="outline"
      size="icon"
      className="rounded-xl w-10 h-10 transition-all bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 z-10"
    >
      <Heart 
        className={`w-5 h-5 transition-colors ${
          isWishlisted ? "fill-rose-500 text-rose-500" : "text-zinc-500"
        }`} 
      />
    </Button>
  )
}

