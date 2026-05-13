import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, content, slug, thumbnail, published } = await req.json()

    if (!title || !content || !slug) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        slug,
        thumbnail,
        isPublished: published ?? false,
        authorId: session.user.id
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error("[ARTICLES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true }
    })
    return NextResponse.json(articles)
  } catch (error) {
    console.error("[ARTICLES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
