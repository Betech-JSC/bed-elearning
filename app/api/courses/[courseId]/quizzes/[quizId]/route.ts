import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string, quizId: string }> }
) {
  try {
    const session = await auth()
    const { courseId, quizId } = await params

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: courseId,
        instructorId: session.user.id
      }
    })

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const deletedQuiz = await prisma.quiz.delete({
      where: {
        id: quizId,
        courseId
      }
    })

    return NextResponse.json(deletedQuiz)
  } catch (error) {
    console.error("[QUIZ_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
