import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 })
    }

    const { instructorId } = await req.json()

    if (!instructorId) {
      return NextResponse.json({ message: "Thiếu ID giảng viên" }, { status: 400 })
    }

    // Verify instructor exists
    const instructor = await prisma.user.findFirst({
      where: {
        id: instructorId,
        role: "INSTRUCTOR"
      }
    })

    if (!instructor) {
      return NextResponse.json({ message: "Không tìm thấy giảng viên này" }, { status: 404 })
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findUnique({
      where: {
        userId_instructorId: {
          userId,
          instructorId
        }
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true
          }
        }
      }
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId,
          instructorId
        },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              image: true,
              bio: true
            }
          }
        }
      })
    }

    return NextResponse.json({ conversation })

  } catch (error) {
    console.error("Create conversation error:", error)
    return NextResponse.json({ message: "Lỗi hệ thống khi tải cuộc hội thoại" }, { status: 500 })
  }
}
