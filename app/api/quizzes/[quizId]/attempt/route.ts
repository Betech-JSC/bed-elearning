import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await auth()
    const { quizId } = await params
    const { answers } = await req.json() // Expecting { [questionId]: optionId }

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { options: true }
        }
      }
    })

    if (!quiz) {
      return new NextResponse("Quiz not found", { status: 404 })
    }

    let correctAnswers = 0
    const totalQuestions = quiz.questions.length

    if (totalQuestions > 0) {
      quiz.questions.forEach((question) => {
        const correctOption = question.options.find(opt => opt.isCorrect)
        if (correctOption && answers[question.id] === correctOption.id) {
          correctAnswers++
        }
      })
    }

    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100
    const passed = score >= quiz.passingScore

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId,
        score,
        passed
      }
    })

    // Auto complete lesson if passed and linked to a lesson
    if (passed && quiz.lessonId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: quiz.courseId
          }
        }
      })
      
      if (enrollment) {
        await prisma.progress.upsert({
          where: {
            enrollmentId_lessonId: {
              enrollmentId: enrollment.id,
              lessonId: quiz.lessonId
            }
          },
          update: {
            isCompleted: true
          },
          create: {
            enrollmentId: enrollment.id,
            lessonId: quiz.lessonId,
            isCompleted: true
          }
        })
      }
    }

    return NextResponse.json(attempt)
  } catch (error) {
    console.error("[QUIZ_ATTEMPT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
