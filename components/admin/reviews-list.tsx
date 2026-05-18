"use client"

import { useState, useTransition } from "react"
import { deleteReview } from "@/lib/actions/admin"
import { Trash2, Search, Star, MessageSquare, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ReviewWithUserAndCourse {
  id: string
  rating: number
  comment: string | null
  createdAt: Date
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
  course: {
    title: string
    slug: string
  }
}

interface ReviewsListProps {
  initialReviews: ReviewWithUserAndCourse[]
}

export function ReviewsList({ initialReviews }: ReviewsListProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [search, setSearch] = useState("")
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  // Handle local delete with transition
  const handleDelete = async (reviewId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này khỏi hệ thống?")) return

    startTransition(async () => {
      try {
        await deleteReview(reviewId)
        setReviews(prev => prev.filter(r => r.id !== reviewId))
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa đánh giá.")
      }
    })
  }

  // Filter logic
  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      (r.user.name?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (r.user.email?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (r.comment?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (r.course.title.toLowerCase().includes(search.toLowerCase()))

    const matchesRating = ratingFilter === null || r.rating === ratingFilter

    return matchesSearch && matchesRating
  })

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm học viên, khóa học hoặc bình luận..." 
            className="pl-10 h-11 rounded-2xl bg-zinc-50 border-zinc-100 hover:border-zinc-200 focus-visible:ring-orange-500/20"
          />
        </div>

        {/* Rating filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 justify-end">
          <button 
            onClick={() => setRatingFilter(null)}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 shrink-0",
              ratingFilter === null 
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            )}
          >
            Tất cả
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button 
              key={star}
              onClick={() => setRatingFilter(star)}
              className={cn(
                "px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-1 shrink-0",
                ratingFilter === star 
                  ? "bg-gradient-to-r from-[#FF6600] to-[#FF8533] text-white shadow-sm shadow-orange-500/10"
                  : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-transparent"
              )}
            >
              {star}
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      {filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all flex flex-col justify-between relative group"
            >
              {/* Review Card Header */}
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  {/* User info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
                      <AvatarImage src={review.user.image || ""} />
                      <AvatarFallback className="bg-orange-50 text-[#FF6600] font-bold">
                        {review.user.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-zinc-900 dark:text-zinc-100 text-sm truncate">{review.user.name || "Học viên"}</span>
                      <span className="text-[10px] text-zinc-400 font-bold truncate">{review.user.email}</span>
                    </div>
                  </div>

                  {/* Stars rating */}
                  <div className="flex items-center gap-0.5 bg-orange-50 dark:bg-orange-950/20 px-2.5 py-1 rounded-xl">
                    <span className="text-xs font-black text-[#FF6600] mr-1">{review.rating}</span>
                    <Star className="w-3.5 h-3.5 text-[#FF6600] fill-current" />
                  </div>
                </div>

                {/* Course context badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-50 dark:bg-zinc-800 rounded-xl max-w-full">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest shrink-0">Khóa học:</span>
                  <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-300 truncate">{review.course.title}</span>
                </div>

                {/* Comment content */}
                <p className="text-zinc-600 dark:text-zinc-300 font-medium text-sm leading-relaxed italic">
                  "{review.comment || "Không có nội dung nhận xét."}"
                </p>
              </div>

              {/* Card Footer actions */}
              <div className="flex justify-between items-center pt-5 mt-6 border-t border-zinc-50 dark:border-zinc-800">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>

                <Button 
                  onClick={() => handleDelete(review.id)}
                  disabled={isPending}
                  variant="ghost" 
                  className="rounded-xl hover:bg-red-50 hover:text-red-600 text-zinc-400 dark:hover:bg-red-950/20 px-3.5 py-2.5 h-auto transition-all"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  <span className="text-xs font-bold">Xóa kiểm duyệt</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-16 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center text-zinc-400">
            <AlertCircle className="w-8 h-8 opacity-40" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Không tìm thấy đánh giá</h3>
            <p className="text-xs text-zinc-500 font-medium max-w-sm">Không có bài nhận xét nào khớp với điều kiện tìm kiếm hoặc phân loại của bạn.</p>
          </div>
        </div>
      )}
    </div>
  )
}
