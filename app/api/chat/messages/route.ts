import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await auth()
    const currentUserId = session?.user?.id

    if (!currentUserId) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json({ message: "Thiếu ID cuộc trò chuyện" }, { status: 400 })
    }

    // Verify conversation exists and user is part of it
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    })

    if (!conversation) {
      return NextResponse.json({ message: "Không tìm thấy cuộc trò chuyện" }, { status: 404 })
    }

    if (conversation.userId !== currentUserId && conversation.instructorId !== currentUserId) {
      return NextResponse.json({ message: "Không có quyền truy cập cuộc trò chuyện này" }, { status: 403 })
    }

    // Fetch messages sorted chronologically
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" }
    })

    return NextResponse.json({ messages })

  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ message: "Lỗi hệ thống khi tải tin nhắn" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const currentUserId = session?.user?.id

    if (!currentUserId) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 })
    }

    const { conversationId, content } = await req.json()

    if (!conversationId || !content || content.trim() === "") {
      return NextResponse.json({ message: "Thông tin không hợp lệ" }, { status: 400 })
    }

    // Verify conversation exists and user is part of it
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    })

    if (!conversation) {
      return NextResponse.json({ message: "Không tìm thấy cuộc trò chuyện" }, { status: 404 })
    }

    if (conversation.userId !== currentUserId && conversation.instructorId !== currentUserId) {
      return NextResponse.json({ message: "Không có quyền gửi tin nhắn vào cuộc trò chuyện này" }, { status: 403 })
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: currentUserId,
        content: content.trim()
      }
    })

    // Update conversation updatedAt timestamp to float it to top if sorted by date
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json({ message })

  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ message: "Lỗi hệ thống khi gửi tin nhắn" }, { status: 500 })
  }
}
