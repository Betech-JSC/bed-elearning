import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/mail"

const forgotSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = forgotSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    // To prevent email enumeration, always return success even if user not found
    if (!user) {
      return NextResponse.json({ message: "Nếu email tồn tại, link khôi phục đã được gửi." }, { status: 200 })
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600 * 1000) // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      }
    })

    // Gửi email khôi phục
    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ message: "Đã gửi link khôi phục." }, { status: 200 })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "Lỗi hệ thống" }, { status: 500 })
  }
}
