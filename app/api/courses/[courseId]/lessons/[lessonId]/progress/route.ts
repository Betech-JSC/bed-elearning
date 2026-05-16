import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { courseId, lessonId } = await params
    const { isCompleted, currentTime } = await req.json()

    // Find enrollment first
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    if (!enrollment) {
      return new NextResponse("Not enrolled", { status: 403 })
    }

    // Check existing progress to prevent duplicate XP
    const existingProgress = await prisma.progress.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: lessonId,
        },
      }
    })

    const wasAlreadyCompleted = existingProgress?.isCompleted || false

    // Upsert progress
    const progress = await prisma.progress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: lessonId,
        },
      },
      update: {
        isCompleted,
        currentTime,
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId: lessonId,
        isCompleted,
        currentTime,
      },
    })

    // Award XP if newly completed
    if (isCompleted && !wasAlreadyCompleted) {
        await prisma.user.update({
            where: { id: userId },
            data: { xp: { increment: 10 } }
        })
    }

    // Recalculate overall progress if completed
    if (isCompleted) {
        const allLessons = await prisma.lesson.findMany({
            where: { section: { courseId } }
        })
        const completedCount = await prisma.progress.count({
            where: { enrollmentId: enrollment.id, isCompleted: true }
        })
        
        const progressPercent = allLessons.length > 0 
            ? Math.round((completedCount / allLessons.length) * 100) 
            : 100

        await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {
                progress: progressPercent,
                isCompleted: progressPercent === 100,
                completedAt: progressPercent === 100 ? new Date() : enrollment.completedAt
            }
        })
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error("[LESSON_PROGRESS_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
    try {
        const session = await auth()
        const userId = session?.user?.id

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { courseId, lessonId } = await params

        const progress = await prisma.progress.findFirst({
            where: {
                lessonId,
                enrollment: {
                    userId,
                    courseId
                }
            }
        })

        return NextResponse.json(progress || { isCompleted: false, currentTime: 0 })
    } catch (error) {
        console.error("[LESSON_PROGRESS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}