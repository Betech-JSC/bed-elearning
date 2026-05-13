import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()
    const { courseId } = await params

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 })
    }

    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    })

    if (existingWishlist) {
      // Remove from wishlist
      await prisma.wishlist.delete({
        where: { id: existingWishlist.id }
      })
      return NextResponse.json({ isWishlisted: false })
    } else {
      // Add to wishlist
      await prisma.wishlist.create({
        data: {
          userId: session.user.id,
          courseId: courseId
        }
      })
      return NextResponse.json({ isWishlisted: true })
    }
  } catch (error) {
    console.error("[WISHLIST_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
