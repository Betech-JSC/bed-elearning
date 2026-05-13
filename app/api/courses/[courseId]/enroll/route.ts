import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { courseId } = await params

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        status: "PUBLISHED"
      }
    })

    if (!course) {
      return new NextResponse("Course not found", { status: 404 })
    }

    // BUG-02 FIX: Chỉ cho phép enroll trực tiếp nếu khóa học miễn phí (price = 0)
    if (course.price > 0) {
      return new NextResponse("Course is not free", { status: 400 })
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {}, // Đã enroll rồi thì không làm gì
      create: {
        userId,
        courseId,
      },
    })

    return NextResponse.json(enrollment)
  } catch (error) {
    console.error("[COURSE_ENROLL_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}