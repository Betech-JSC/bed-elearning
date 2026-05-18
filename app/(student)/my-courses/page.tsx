import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { MyCoursesContent } from "@/components/my-courses/my-courses-content"

export default async function MyCoursesPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return redirect("/login")
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          enrollments: { select: { id: true } },
          reviews: { select: { rating: true } }
        }
      }
    },
    orderBy: { updatedAt: "desc" }
  })

  return <MyCoursesContent initialEnrollments={enrollments} />
}
