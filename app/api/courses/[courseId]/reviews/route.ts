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
    const { rating, comment } = await req.json()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId
        }
      }
    })

    if (!enrollment) {
      return new NextResponse("Must be enrolled to review", { status: 403 })
    }

    const review = await prisma.review.upsert({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId
        }
      },
      update: {
        rating,
        comment
      },
      create: {
        userId: session.user.id,
        courseId,
        rating,
        comment
      }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("[COURSE_REVIEW_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
