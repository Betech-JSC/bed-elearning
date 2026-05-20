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

    const { 
      name, 
      bio, 
      image,
      coverImage,
      portfolioContent,
      githubUrl,
      twitterUrl,
      linkedinUrl,
      youtubeUrl,
      websiteUrl
    } = await req.json()

    if (name && name.length < 2) {
      return NextResponse.json({ message: "Tên quá ngắn" }, { status: 400 })
    }

    const userRole = session?.user?.role
    const isInstructorOrAdmin = userRole === "INSTRUCTOR" || userRole === "ADMIN"

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        image,
        ...(isInstructorOrAdmin ? {
          bio,
          coverImage,
          portfolioContent,
          githubUrl,
          twitterUrl,
          linkedinUrl,
          youtubeUrl,
          websiteUrl
        } : {})
      }
    })

    return NextResponse.json({ 
      message: "Cập nhật thành công",
      user: {
        name: updatedUser.name,
        bio: updatedUser.bio,
        image: updatedUser.image,
        coverImage: updatedUser.coverImage,
        portfolioContent: updatedUser.portfolioContent,
        githubUrl: updatedUser.githubUrl,
        twitterUrl: updatedUser.twitterUrl,
        linkedinUrl: updatedUser.linkedinUrl,
        youtubeUrl: updatedUser.youtubeUrl,
        websiteUrl: updatedUser.websiteUrl
      }
    })

  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Lỗi hệ thống" }, { status: 500 })
  }
}
