import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getInstructorBalance } from "@/lib/revenue"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()

    // BUG-06 FIX: Allow ADMIN to also create payouts, and restrict properly
    if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { amount, bankInfo } = await req.json()

    if (!amount || amount < 100000) {
      return NextResponse.json({ message: "Số tiền rút tối thiểu là 100.000đ" }, { status: 400 })
    }

    if (!bankInfo || typeof bankInfo !== "string" || bankInfo.trim() === "") {
      return NextResponse.json({ message: "Vui lòng cung cấp thông tin ngân hàng" }, { status: 400 })
    }

    // Verify balance
    const { availableBalance } = await getInstructorBalance(session.user.id)
    if (amount > availableBalance) {
      return NextResponse.json({ message: "Số dư không đủ để thực hiện yêu cầu này" }, { status: 400 })
    }

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
