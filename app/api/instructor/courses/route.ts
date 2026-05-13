import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import slugify from "slugify"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    const role = session?.user?.role

    if (!userId || (role !== "INSTRUCTOR" && role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title } = await req.json()

    if (!title) {
      return NextResponse.json({ message: "Tiêu đề là bắt buộc" }, { status: 400 })
    }

    // Generate unique slug
    let baseSlug = slugify(title, { lower: true, strict: true, locale: 'vi' })
    let slug = baseSlug
    let counter = 1
    
    while (await prisma.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const course = await prisma.course.create({
      data: {
        instructorId: userId,
        title,
        slug,
        status: "DRAFT",
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("[COURSES_POST]", error)
    return NextResponse.json({ message: "Internal Error" }, { status: 500 })
  }
}
