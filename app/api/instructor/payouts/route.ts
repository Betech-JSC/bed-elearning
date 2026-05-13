import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()

    // BUG-06 FIX: Allow ADMIN to also create payouts, and restrict properly
    if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { amount, bankInfo } = await req.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Số tiền không hợp lệ" }, { status: 400 })
    }

    if (!bankInfo || typeof bankInfo !== "string" || bankInfo.trim() === "") {
      return NextResponse.json({ message: "Vui lòng cung cấp thông tin ngân hàng" }, { status: 400 })
    }

    // BUG-06 FIX: bankInfo is now a valid field in the schema
    const payout = await prisma.payout.create({
      data: {
        instructorId: session.user.id,
        amount,
        bankInfo: bankInfo.trim(),
        status: "PENDING"
      }
    })

    return NextResponse.json(payout)
  } catch (error) {
    console.error("[PAYOUTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
