"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

async function checkInstructor(courseId: string) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("Unauthorized")

  const course = await prisma.course.findUnique({
    where: { id: courseId, instructorId: userId }
  })

  if (!course && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
  return userId
}

// SECTION ACTIONS
export async function createSection(courseId: string, title: string) {
  await checkInstructor(courseId)
  
  const lastSection = await prisma.section.findFirst({
    where: { courseId },
    orderBy: { order: "desc" }
  })

  const newSection = await prisma.section.create({
    data: {
      title,
      courseId,
      order: lastSection ? lastSection.order + 1 : 0
    }
  })

  revalidatePath(`/instructor/courses/${courseId}/edit`)
  return newSection
}

// LESSON ACTIONS
export async function createLesson(courseId: string, sectionId: string, title: string) {
  await checkInstructor(courseId)

  const lastLesson = await prisma.lesson.findFirst({
    where: { sectionId },
    orderBy: { order: "desc" }
  })

  const newLesson = await prisma.lesson.create({
    data: {
      title,
      sectionId,
      order: lastLesson ? lastLesson.order + 1 : 0
    }
  })

  revalidatePath(`/instructor/courses/${courseId}/edit`)
  return newLesson
}

export async function updateLesson(courseId: string, lessonId: string, values: any) {
  await checkInstructor(courseId)

  const lesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: { ...values }
  })

  revalidatePath(`/instructor/courses/${courseId}/edit`)
  return lesson
}

export async function deleteLesson(courseId: string, lessonId: string) {
  await checkInstructor(courseId)
  
  await prisma.lesson.delete({
    where: { id: lessonId }
  })

  revalidatePath(`/instructor/courses/${courseId}/edit`)
}

export async function deleteSection(courseId: string, sectionId: string) {
    await checkInstructor(courseId)
    
    await prisma.section.delete({
      where: { id: sectionId }
    })
  
    revalidatePath(`/instructor/courses/${courseId}/edit`)
}
