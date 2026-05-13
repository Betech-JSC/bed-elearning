import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { ArticlesClient } from "./_components/articles-client"

export default async function AdminArticlesPage() {
  const session = await auth()
  
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return redirect("/")
  }

  const articles = await prisma.article.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black">Quản lý Bài viết (Blog)</h1>
        <p className="text-zinc-500">Viết và xuất bản các bài hướng dẫn, tin tức công nghệ.</p>
      </div>
      
      <ArticlesClient articles={articles} />
    </div>
  )
}
