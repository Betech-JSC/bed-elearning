"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { notifyQnaReply } from "@/lib/actions/notifications"

export async function createQuestion({
  lessonId,
  body,
  title = "Câu hỏi bài học"
}: {
  lessonId: string
  body: string
  title?: string
}) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) throw new Error("Unauthorized")
    if (!body || body.trim().length < 2) throw new Error("Nội dung quá ngắn")

    const question = await prisma.question.create({
      data: {
        title,
        body,
        lessonId,
        userId
      }
    })

    revalidatePath(`/learn/[slug]/${lessonId}`, "page")
    return { success: true, data: question }
  } catch (error: any) {
    console.error("[CREATE_QUESTION]", error)
    return { success: false, error: error.message }
  }
}

export async function createAnswer({
  questionId,
  body,
  lessonId
}: {
  questionId: string
  body: string
  lessonId: string
}) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) throw new Error("Unauthorized")
    if (!body || body.trim().length < 1) throw new Error("Nội dung không được để trống")

    const answer = await prisma.answer.create({
      data: {
        body,
        questionId,
        userId
      }
    })

    try {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
        select: { userId: true }
      })

      if (question && question.userId !== userId) {
        await notifyQnaReply(question.userId, lessonId, session.user.name || "Học viên/Giáo viên")
      }
    } catch (notifError) {
      console.error("[QNA_ACTION_NOTIF_ERROR]", notifError)
    }

    revalidatePath(`/learn/[slug]/${lessonId}`, "page")
    return { success: true, data: answer }
  } catch (error: any) {
    console.error("[CREATE_ANSWER]", error)
    return { success: false, error: error.message }
  }
}

export async function toggleResolve(questionId: string, lessonId: string) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) throw new Error("Unauthorized")

    const question = await prisma.question.findUnique({
      where: { id: questionId }
    })

    if (!question) throw new Error("Question not found")
    
    // Only author or admin/instructor can resolve
    // Check if user is instructor of the course
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { section: { include: { course: true } } }
    })

    const isAuthor = question.userId === userId
    const isInstructor = lesson?.section.course.instructorId === userId
    const isAdmin = session.user.role === "ADMIN"

    if (!isAuthor && !isInstructor && !isAdmin) {
        throw new Error("Unauthorized")
    }

    const updated = await prisma.question.update({
      where: { id: questionId },
      data: { isResolved: !question.isResolved }
    })

    revalidatePath(`/learn/[slug]/${lessonId}`, "page")
    return { success: true, data: updated }
  } catch (error: any) {
    console.error("[TOGGLE_RESOLVE]", error)
    return { success: false, error: error.message }
  }
}

export async function deleteQuestion(questionId: string, lessonId: string) {
    try {
      const session = await auth()
      const userId = session?.user?.id
  
      if (!userId) throw new Error("Unauthorized")
  
      const question = await prisma.question.findUnique({
        where: { id: questionId }
      })
  
      if (!question) throw new Error("Question not found")
      
      const isAuthor = question.userId === userId
      const isAdmin = session.user.role === "ADMIN"
  
      if (!isAuthor && !isAdmin) {
          throw new Error("Unauthorized")
      }
  
      await prisma.question.delete({
        where: { id: questionId }
      })
  
      revalidatePath(`/learn/[slug]/${lessonId}`, "page")
      return { success: true }
    } catch (error: any) {
      console.error("[DELETE_QUESTION]", error)
      return { success: false, error: error.message }
    }
}
