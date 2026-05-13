import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { LessonForm } from "@/components/instructor/lesson-form"

export default async function LessonEditPage({
  params
}: {
  params: Promise<{ courseId: string, lessonId: string }>
}) {
  const { courseId, lessonId } = await params
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return redirect("/")

  const lesson = await prisma.lesson.findUnique({
    where: { 
      id: lessonId,
      section: {
        course: {
          instructorId: userId
        }
      }
    }
  })

  if (!lesson) return notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <LessonForm 
        courseId={courseId}
        lesson={lesson}
      />
    </div>
  )
}
