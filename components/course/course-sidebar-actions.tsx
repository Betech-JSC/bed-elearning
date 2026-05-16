"use client"

import { useState } from "react"
import { Heart, Share2, Check } from "lucide-react"
import { WishlistButton } from "./wishlist-button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CourseSidebarActionsProps {
  courseId: string
  courseTitle: string
}

export function CourseSidebarActions({ courseId, courseTitle }: CourseSidebarActionsProps) {
  const [isShared, setIsShared] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: courseTitle,
          text: `Khám phá khóa học ${courseTitle} trên Belearning!`,
          url: url,
        })
      } catch (error) {
        console.log("Error sharing", error)
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(url)
      setIsShared(true)
      toast.success("Đã sao chép liên kết vào bộ nhớ tạm")
      setTimeout(() => setIsShared(false), 2000)
    }
  }

  return (
    <div className="flex items-center justify-center gap-8 py-2">
      {/* Favorite / Wishlist */}
      <div className="flex flex-col items-center gap-2 group cursor-pointer">
        <WishlistButton courseId={courseId} />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition-colors">Yêu thích</span>
      </div>

      {/* Share */}
      <button 
        onClick={handleShare}
        className="flex flex-col items-center gap-2 group cursor-pointer"
      >
        <div className={cn(
            "w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-[#FF6600] group-hover:bg-orange-50 transition-all border border-transparent group-hover:border-orange-100",
            isShared && "text-emerald-500 bg-emerald-50 border-emerald-100"
        )}>
          {isShared ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition-colors">Chia sẻ</span>
      </button>
    </div>
  )
}
