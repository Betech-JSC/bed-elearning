import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()
    const { courseId } = await params
    const { title, passingScore } = await req.json()

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

    const quiz = await prisma.quiz.create({
      data: {
        title,
        passingScore: passingScore || 80,
        courseId
      },
      include: {
        questions: true
      }
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error("[QUIZ_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
