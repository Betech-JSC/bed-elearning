import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Vui lòng nhập đầy đủ thông tin" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ message: "Mật khẩu mới phải có ít nhất 8 ký tự" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || !user.password) {
      return NextResponse.json({ message: "Tài khoản không hỗ trợ đổi mật khẩu (đăng nhập bằng Google?)" }, { status: 400 })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      return NextResponse.json({ message: "Mật khẩu hiện tại không chính xác" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword
      }
    })

    return NextResponse.json({ message: "Đổi mật khẩu thành công" })

  } catch (error) {
    console.error("Password update error:", error)
    return NextResponse.json({ message: "Lỗi hệ thống" }, { status: 500 })
  }
}
