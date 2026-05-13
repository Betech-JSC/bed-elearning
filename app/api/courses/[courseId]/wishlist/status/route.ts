import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()
    const { courseId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ isWishlisted: false })
    }

    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    })

    return NextResponse.json({ isWishlisted: !!existingWishlist })
  } catch (error) {
    console.error("[WISHLIST_STATUS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
