import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")

    const progress = await prisma.progress.findMany({
      where: {
        enrollment: {
          userId,
          ...(courseId ? { courseId } : {})
        }
      },
      include: {
          lesson: true
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error("[PROGRESS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}