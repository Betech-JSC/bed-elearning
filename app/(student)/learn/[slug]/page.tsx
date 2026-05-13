import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"

export default async function LearnIndexPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" }
          }
        }
      }
    }
  })

  // BUG-24 FIX: Redirect to course landing page instead of home if no content
  if (!course) {
      return redirect("/")
  }

  if (course.sections.length === 0 || course.sections[0].lessons.length === 0) {
    return redirect(`/courses/${slug}`) 
  }

  const firstLessonId = course.sections[0].lessons[0].id

  return redirect(`/learn/${slug}/${firstLessonId}`)
}
