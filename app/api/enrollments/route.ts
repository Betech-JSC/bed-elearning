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

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId
      },
      include: {
        course: {
          include: {
            category: true,
            instructor: {
                select: {
                    name: true,
                    image: true
                }
            }
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    })

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error("[ENROLLMENTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}