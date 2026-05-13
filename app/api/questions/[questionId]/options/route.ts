import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// POST /api/questions/[questionId]/options
export async function POST(
  req: Request,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const session = await auth()
    const { questionId } = await params
    const { text, isCorrect } = await req.json()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Verify ownership via question -> quiz -> course
    const question = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
      include: { 
        quiz: {
          include: { course: true }
        }
      }
    })

    if (!question || (question.quiz.course.instructorId !== session.user.id && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const option = await prisma.quizOption.create({
      data: {
        text,
        isCorrect: isCorrect || false,
        questionId
      }
    })

    return NextResponse.json(option)
  } catch (error) {
    console.error("[QUIZ_OPTIONS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
