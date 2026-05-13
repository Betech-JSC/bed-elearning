import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await auth()
    const { lessonId } = await params
    const { title, body } = await req.json()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!body) {
      return new NextResponse("Missing body", { status: 400 })
    }

    const question = await prisma.question.create({
      data: {
        title: title || "Câu hỏi",
        body,
        lessonId,
        userId: session.user.id
      }
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error("[QUESTIONS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
