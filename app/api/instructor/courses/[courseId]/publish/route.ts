import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        instructorId: session.user.id
      },
      include: {
        sections: {
          include: {
            lessons: true
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    // BUG-12 FIX: Check if course has minimum requirements and at least one lesson
    if (!course.title || !course.description || !course.categoryId) {
      return NextResponse.json({ message: "Thiếu các thông tin bắt buộc (Tiêu đề, Mô tả, Danh mục)" }, { status: 400 })
    }

    const hasLessons = course.sections.some(section => section.lessons.length > 0)
    if (!hasLessons) {
        return NextResponse.json({ message: "Khóa học phải có ít nhất một bài học để gửi duyệt" }, { status: 400 })
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        status: "PENDING_REVIEW"
      }
    })

    // BUG-11 FIX: Return JSON response consistently
    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error("[COURSE_PUBLISH]", error)
    return NextResponse.json({ message: "Internal Error" }, { status: 500 })
  }
}