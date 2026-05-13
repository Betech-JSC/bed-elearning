import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Star, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default async function InstructorReviewsPage() {
  const session = await auth()
  if (!session?.user?.id) return redirect("/login")
  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    return redirect("/")
  }

  const reviews = await prisma.review.findMany({
    where: {
      course: {
        instructorId: session.user.id
      }
    },
    include: {
      user: true,
      course: {
        select: { title: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-black">Đánh giá từ học viên</h1>
        <p className="text-zinc-500 mt-1">Xem phản hồi và đánh giá của học viên về các khóa học của bạn.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-12 text-center text-zinc-500 shadow-sm">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-medium">Chưa có đánh giá nào cho các khóa học của bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {review.user.name?.[0] || "?"}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{review.user.name}</p>
                    <p className="text-xs text-zinc-500">{format(new Date(review.createdAt), "dd/MM/yyyy")}</p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={cn(
                        "w-4 h-4",
                        s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-200"
                      )} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{review.course.title}</p>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
