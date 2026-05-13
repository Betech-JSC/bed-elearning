import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const resetSchema = z.object({
  token: z.string(),
  password: z.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = resetSchema.parse(body)

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json({ message: "Token không tồn tại." }, { status: 400 })
    }

    if (resetToken.used) {
      return NextResponse.json({ message: "Token đã được sử dụng." }, { status: 400 })
    }

    if (new Date() > resetToken.expires) {
      return NextResponse.json({ message: "Token đã hết hạn." }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    })

    if (!user) {
      return NextResponse.json({ message: "Người dùng không tồn tại." }, { status: 404 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Cập nhật password và đánh dấu token đã dùng trong transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          failedAttempts: 0,
          lastFailedLogin: null
        }
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true }
      })
    ])

    return NextResponse.json({ message: "Cập nhật mật khẩu thành công." }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 })
    }
    console.error("Reset password error:", error)
    return NextResponse.json({ message: "Lỗi hệ thống" }, { status: 500 })
  }
}
