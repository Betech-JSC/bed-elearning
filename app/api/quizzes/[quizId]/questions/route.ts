import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// POST /api/quizzes/[quizId]/questions
export async function POST(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await auth()
    const { quizId } = await params
    const { prompt, order } = await req.json()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { course: true }
    })

    if (!quiz || (quiz.course.instructorId !== session.user.id && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const question = await prisma.quizQuestion.create({
      data: {
        prompt,
        order: order || 0,
        quizId
      }
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error("[QUIZ_QUESTIONS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
