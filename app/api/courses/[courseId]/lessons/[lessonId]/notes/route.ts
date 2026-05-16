import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string, lessonId: string }> }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { lessonId } = await params

    const notes = await prisma.note.findMany({
      where: {
        userId,
        lessonId,
      },
      orderBy: {
        timestamp: "asc",
      },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error("[NOTES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string, lessonId: string }> }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { lessonId } = await params
    const { content, timestamp } = await req.json()

    if (!content) {
      return new NextResponse("Missing content", { status: 400 })
    }

    const note = await prisma.note.create({
      data: {
        content,
        timestamp: parseFloat(timestamp) || 0,
        userId,
        lessonId,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error("[NOTES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
