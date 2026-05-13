import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ message: "Bạn cần đăng nhập để thực hiện hành động này." }, { status: 401 })
    }

    const { code, amount } = await req.json()

    if (!code) {
      return NextResponse.json({ message: "Vui lòng nhập mã giảm giá." }, { status: 400 })
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase(), isActive: true },
      include: {
        usages: {
          where: { userId }
        }
      }
    })

    if (!coupon) {
      return NextResponse.json({ message: "Mã giảm giá không hợp lệ hoặc đã hết hạn." }, { status: 404 })
    }

    // BUG-14 FIX: Dùng so sánh Date thực sự thay vì string comparison
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ message: "Mã giảm giá đã hết hạn." }, { status: 400 })
    }

    // Check max uses
    if (coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ message: "Mã giảm giá đã hết lượt sử dụng." }, { status: 400 })
    }

    // Check min order amount
    if (amount < coupon.minOrderAmount) {
      return NextResponse.json({ 
        message: `Đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.minOrderAmount)} để sử dụng mã này.` 
      }, { status: 400 })
    }

    // Check if user already used this coupon
    if (coupon.usages.length > 0) {
      return NextResponse.json({ message: "Bạn đã sử dụng mã giảm giá này rồi." }, { status: 400 })
    }

    return NextResponse.json({
      message: "Áp dụng mã giảm giá thành công!",
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value
      }
    })

  } catch (error) {
    console.error("Coupon validation error:", error)
    return NextResponse.json({ message: "Lỗi hệ thống." }, { status: 500 })
  }
}
