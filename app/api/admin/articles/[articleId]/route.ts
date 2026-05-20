import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { articleId } = await params
    const { title, content, slug, thumbnail, published } = await req.json()

    if (!title || !content || !slug) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        title,
        content,
        slug,
        thumbnail,
        isPublished: published ?? false,
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error("[ARTICLE_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { articleId } = await params

    const article = await prisma.article.delete({
      where: { id: articleId }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error("[ARTICLE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
