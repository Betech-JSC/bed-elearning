import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { createAuditLog } from "@/lib/audit-log"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ payoutId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { payoutId } = await params
    const { status, notes } = await req.json()

    // BUG-07 FIX: PayoutStatus enum chỉ có PAID và FAILED (không có COMPLETED)
    if (!["PAID", "FAILED"].includes(status)) {
      return NextResponse.json(
        { message: "Trạng thái không hợp lệ. Chỉ chấp nhận PAID hoặc FAILED." },
        { status: 400 }
      )
    }

    // BUG-07 FIX: Dùng notes (có trong schema) thay vì remarks, thêm processedAt (giờ có trong schema)
    const payout = await prisma.payout.update({
      where: { id: payoutId },
      data: {
        status,
        notes,
        processedAt: new Date()
      }
    })

    await createAuditLog(
      session.user.id,
      status === "PAID" ? "PAYOUT_APPROVED" : "PAYOUT_REJECTED",
      payoutId,
      "PAYOUT",
      { status, notes, amount: payout.amount }
    )

    return NextResponse.json(payout)
  } catch (error) {
    console.error("[PAYOUTS_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
