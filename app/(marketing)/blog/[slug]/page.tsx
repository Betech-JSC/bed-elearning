import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Clock, User } from "lucide-react"

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: true }
  })

  if (!article || !article.isPublished) {
    return notFound()
  }

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-950 pb-24">
      <div className="bg-zinc-50 dark:bg-zinc-900 border-b">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          <Link href="/blog" className="inline-flex items-center text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors mb-8">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Quay lại Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {article.author?.name?.[0] || <User className="w-4 h-4" />}
              </div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{article.author?.name || "Vibecode"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                 year: 'numeric',
                 month: 'long',
                 day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12">
        {article.thumbnail && (
          <div className="aspect-video relative rounded-3xl overflow-hidden shadow-2xl mb-12">
            <Image 
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* Note: In a real app, article.content would likely be HTML from a Rich Text Editor. 
              Here we just render it as text for MVP purposes. */}
          <div className="whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300">
            {article.content}
          </div>
        </div>
      </div>
    </article>
  )
}
