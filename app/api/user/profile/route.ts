import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, bio } = await req.json()

    if (name && name.length < 2) {
      return NextResponse.json({ message: "Tên quá ngắn" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio
      }
    })

    return NextResponse.json({ 
      message: "Cập nhật thành công",
      user: {
        name: updatedUser.name,
        bio: updatedUser.bio
      }
    })

  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Lỗi hệ thống" }, { status: 500 })
  }
}
