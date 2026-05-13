import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import slugify from "slugify"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const session = await auth()
    const values = await req.json()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Explicitly check for course ownership
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: session.user.id
      }
    })

    if (!course && session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    // List of allowed fields to update
    const allowedFields = [
      "title", 
      "description", 
      "price", 
      "salePrice", 
      "categoryId", 
      "level", 
      "thumbnail",
      "whatYouWillLearn",
      "requirements",
      "targetAudience"
    ]

    const updateData: any = {}
    for (const field of allowedFields) {
      if (values[field] !== undefined) {
        updateData[field] = values[field]
      }
    }

    // BUG-13 FIX: Update slug if title changed
    if (values.title && values.title !== course?.title) {
        let baseSlug = slugify(values.title, { lower: true, strict: true, locale: 'vi' })
        let slug = baseSlug
        let counter = 1
        
        while (await prisma.course.findFirst({ where: { slug, id: { not: courseId } } })) {
          slug = `${baseSlug}-${counter}`
          counter++
        }
        updateData.slug = slug
    }

    if (Object.keys(updateData).length === 0) {
      return new NextResponse("No data to update", { status: 400 })
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: updateData
    })

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error("[COURSE_PATCH_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        instructorId: session.user.id
      }
    })

    if (!course && session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.course.delete({
      where: {
        id: courseId
      }
    })

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("[COURSE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}