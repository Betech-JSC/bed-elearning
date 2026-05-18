import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ReviewsList } from "@/components/admin/reviews-list"
import { Star, MessageSquare } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"

export const dynamic = "force-dynamic"

export default async function AdminReviewsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return redirect("/login")
  }

  const reviews = await prisma.review.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      },
      course: {
        select: {
          title: true,
          slug: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  // Calculate quick stats
  const totalReviews = reviews.length
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0"
  
  const fiveStarReviews = reviews.filter(r => r.rating === 5).length
  const lowRatingReviews = reviews.filter(r => r.rating <= 2).length

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
          <span className="bg-orange-500 text-white p-2 rounded-2xl">
            <Star className="w-6 h-6 fill-current" />
          </span>
          Đánh giá từ Học viên
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-2">
          Theo dõi và kiểm duyệt các đánh giá của học viên trên toàn hệ thống Belearning.
        </p>
      </div>

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Tổng lượt đánh giá" 
          value={totalReviews} 
          icon={MessageSquare} 
          color="orange"
        />
        <StatCard 
          label="Điểm đánh giá TB" 
          value={`${averageRating} ★`} 
          icon={Star} 
          color="blue"
        />
        <StatCard 
          label="Đánh giá 5 sao" 
          value={fiveStarReviews} 
          icon={Star} 
          color="green"
        />
        <StatCard 
          label="Đánh giá tiêu cực" 
          value={lowRatingReviews} 
          icon={Star} 
          color="purple"
        />
      </div>

      {/* Main Reviews Grid Component */}
      <ReviewsList initialReviews={reviews} />
    </div>
  )
}
