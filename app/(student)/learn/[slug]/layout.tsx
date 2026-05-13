import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { LearningSidebar } from "@/components/player/learning-sidebar"
import { CompletionHandler } from "@/components/course/completion-handler"

export default async function LearningLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return redirect("/login")
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              progress: {
                where: {
                  enrollment: {
                    userId
                  }
                }
              }
            }
          }
        }
      },
      enrollments: {
        where: { userId }
      }
    }
  })

  if (!course) {
    return redirect("/")
  }

  const isInstructor = course.instructorId === userId
  const isAdmin = session?.user?.role === "ADMIN"
  const isEnrolled = course.enrollments.length > 0

  if (!isEnrolled && !isInstructor && !isAdmin) {
    return redirect(`/courses/${course.slug}`)
  }

  // Format data for sidebar
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0)
  const completedLessons = course.sections.reduce((acc, s) => 
    acc + s.lessons.filter(l => l.progress[0]?.isCompleted).length, 0
  )

  const isCompleted = totalLessons > 0 && completedLessons === totalLessons

  const formattedSections = course.sections.map(section => ({
    id: section.id,
    title: section.title,
    lessons: section.lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      isCompleted: !!lesson.progress[0]?.isCompleted,
      isLocked: false // In MVP we don't handle serial locking yet
    }))
  }))

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950">
      <LearningSidebar 
        sections={formattedSections} 
        courseSlug={course.slug}
        completedCount={completedLessons}
        totalCount={totalLessons}
      />
      <main className="flex-1 overflow-y-auto relative bg-zinc-50 dark:bg-zinc-900/50">
        <CompletionHandler 
            courseId={course.id} 
            isCompleted={isCompleted} 
        />
        {children}
      </main>
    </div>
  )
}
