import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { CourseCard } from "@/components/ui-custom/course-card"
import { Heart, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function WishlistPage() {
  const session = await auth()
  if (!session?.user?.id) {
    return redirect("/login")
  }

  const wishlists = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          instructor: true,
          category: true,
          _count: {
            select: { enrollments: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          Danh sách yêu thích
        </h1>
        <p className="text-zinc-500 mt-2">Những khóa học bạn đã lưu để xem sau.</p>
      </div>

      {wishlists.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-rose-300" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Chưa có khóa học nào</h2>
          <p className="text-zinc-500 max-w-sm mb-8">Bạn chưa lưu khóa học nào vào danh sách yêu thích. Khám phá các khóa học hấp dẫn ngay!</p>
          <Button asChild className="rounded-xl h-12 px-8 font-bold text-lg">
            <Link href="/courses">Khám phá khóa học</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlists.map(({ course }) => (
            <CourseCard key={course.id} course={course} totalStudents={course._count.enrollments} />
          ))}
        </div>
      )}
    </div>
  )
}
