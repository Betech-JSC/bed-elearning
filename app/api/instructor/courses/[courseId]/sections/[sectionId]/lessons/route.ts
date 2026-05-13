import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string, sectionId: string }> }
) {
  try {
    const { courseId, sectionId } = await params
    const session = await auth()
    const { title } = await req.json()

    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    // BUG-17 FIX: Verify course ownership and section belonging
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        instructorId: session.user.id
      }
    })

    if (!course && session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const section = await prisma.section.findUnique({
        where: { id: sectionId, courseId }
    })

    if (!section) {
        return new NextResponse("Section not found in this course", { status: 404 })
    }

    // BUG-35 FIX: Validate title
    if (!title || typeof title !== "string" || title.trim() === "") {
        return NextResponse.json({ message: "Tiêu đề bài học là bắt buộc" }, { status: 400 })
    }

    const lastLesson = await prisma.lesson.findFirst({
      where: { sectionId },
      orderBy: { order: "desc" }
    })

    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        sectionId,
        order: lastLesson ? lastLesson.order + 1 : 0
      }
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error("[LESSONS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}