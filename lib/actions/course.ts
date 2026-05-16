"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function completeLesson(lessonId: string) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("Unauthorized")

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      section: {
        include: {
          course: true
        }
      }
    }
  })

  if (!lesson) throw new Error("Lesson not found")
  const courseId = lesson.section.courseId

  // Find or create enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } }
  })

  if (!enrollment) throw new Error("Not enrolled")

  const existingProgress = await prisma.progress.findUnique({
    where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } }
  })
  const wasAlreadyCompleted = existingProgress?.isCompleted || false

  // Upsert progress record
  await prisma.progress.upsert({
    where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
    update: { isCompleted: true },
    create: { enrollmentId: enrollment.id, lessonId, isCompleted: true }
  })

  // Award XP if newly completed
  if (!wasAlreadyCompleted) {
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: 10 } }
    })
  }

  // Recalculate overall course progress
  const allLessons = await prisma.lesson.findMany({
    where: { section: { courseId } }
  })
  
  const completedCount = await prisma.progress.count({
    where: { enrollmentId: enrollment.id, isCompleted: true }
  })

  // BUG-18 FIX: Prevent division by zero
  const progressPercent = allLessons.length > 0 
    ? Math.round((completedCount / allLessons.length) * 100) 
    : 100

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progress: progressPercent,
      isCompleted: progressPercent === 100,
      completedAt: progressPercent === 100 ? new Date() : enrollment.completedAt
    }
  })

  revalidatePath(`/learn/${lesson.section.course.slug}/${lessonId}`)
  return { success: true, progress: progressPercent }
}
