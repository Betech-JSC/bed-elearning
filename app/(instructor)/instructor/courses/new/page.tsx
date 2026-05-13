import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CreateCourseForm } from "@/components/instructor/create-course-form"

export default async function NewCoursePage() {
  const session = await auth()
  if (!session?.user?.id) return redirect("/login")
  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    return redirect("/")
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Button asChild variant="ghost" className="mb-8 gap-2 rounded-xl">
        <Link href="/instructor/dashboard">
          <ArrowLeft className="w-4 h-4" />
          Quay lại Dashboard
        </Link>
      </Button>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Tạo khóa học mới</h1>
        <p className="text-zinc-500">Đặt tên cho khóa học của bạn. Đừng lo lắng, bạn có thể thay đổi sau.</p>
      </div>
      <CreateCourseForm instructorId={session.user.id} />
    </div>
  )
}
