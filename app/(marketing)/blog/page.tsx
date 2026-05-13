import prisma from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Clock } from "lucide-react"

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    include: { author: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-zinc-950 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1 mb-6">
             Vibecode Blog
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            Kiến thức Lập trình <br /> & Công nghệ
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Cập nhật những xu hướng công nghệ mới nhất, hướng dẫn học tập và góc nhìn chuyên sâu từ các chuyên gia tại Vibecode Academy.
          </p>
        </div>
      </section>

      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50 flex-1">
        <div className="max-w-7xl mx-auto px-4">
          {articles.length === 0 ? (
             <div className="text-center py-24 bg-white dark:bg-zinc-950 rounded-3xl border">
                <BookOpen className="w-16 h-16 mx-auto mb-6 opacity-20 text-blue-500" />
                <h2 className="text-2xl font-bold mb-2">Chưa có bài viết nào</h2>
                <p className="text-zinc-500">Các bài viết mới sẽ sớm được cập nhật.</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {articles.map((article) => (
                 <Link href={`/blog/${article.slug}`} key={article.id} className="group bg-white dark:bg-zinc-950 rounded-3xl overflow-hidden border hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <div className="aspect-video relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                       <Image 
                          src={article.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                       />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                       <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                          <span className="font-bold text-blue-600">{article.author?.name || "Vibecode"}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(article.createdAt).toLocaleDateString("vi-VN")}</span>
                       </div>
                       <h3 className="text-xl font-black mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                       <p className="text-zinc-500 text-sm line-clamp-3 mb-6 flex-1">{article.content}</p>
                       <div className="flex items-center text-blue-600 font-bold text-sm mt-auto">
                          Đọc tiếp <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                       </div>
                    </div>
                 </Link>
               ))}
             </div>
          )}
        </div>
      </section>
    </div>
  )
}
