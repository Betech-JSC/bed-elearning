import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const session = await auth()
    const { title } = await req.json()

    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    // BUG-16 FIX: Verify course ownership
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        instructorId: session.user.id
      }
    })

    if (!course && session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // BUG-34 FIX: Validate title
    if (!title || typeof title !== "string" || title.trim() === "") {
        return NextResponse.json({ message: "Tiêu đề chương là bắt buộc" }, { status: 400 })
    }

    const lastSection = await prisma.section.findFirst({
      where: { courseId },
      orderBy: { order: "desc" }
    })

    const section = await prisma.section.create({
      data: {
        title: title.trim(),
        courseId,
        order: lastSection ? lastSection.order + 1 : 0
      }
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error("[SECTIONS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}