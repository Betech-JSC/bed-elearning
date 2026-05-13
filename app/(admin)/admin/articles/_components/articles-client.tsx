"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2, Eye, Globe } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface ArticlesClientProps {
  articles: any[]
}

export const ArticlesClient = ({ articles }: ArticlesClientProps) => {
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    thumbnail: "",
    published: false
  })
  const router = useRouter()

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error()

      toast.success("Đã lưu bài viết")
      setIsCreating(false)
      setFormData({ title: "", slug: "", content: "", thumbnail: "", published: false })
      router.refresh()
    } catch {
      toast.error("Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="rounded-xl bg-blue-600 hover:bg-blue-700 gap-2">
            <PlusCircle className="w-4 h-4" />
            Viết bài mới
          </Button>
        )}
      </div>

      {isCreating ? (
        <div className="bg-white dark:bg-zinc-950 border rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Tiêu đề bài viết</label>
              <input 
                className="w-full bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Hướng dẫn học Next.js 15"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Slug (URL)</label>
              <input 
                className="w-full bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="huong-dan-hoc-nextjs-15"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">URL Ảnh bìa</label>
            <input 
              className="w-full bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://images.unsplash.com/..."
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Nội dung bài viết</label>
            <textarea 
              className="w-full bg-zinc-50 dark:bg-zinc-900 border rounded-2xl p-4 min-h-[300px] outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập nội dung bài viết..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="published" className="text-sm font-bold cursor-pointer">Xuất bản ngay</label>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button onClick={() => setIsCreating(false)} variant="ghost" className="rounded-xl">Hủy</Button>
            <Button onClick={onSubmit} disabled={isLoading} className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8">Lưu bài viết</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white dark:bg-zinc-950 border rounded-2xl overflow-hidden shadow-sm flex flex-col group">
              <div className="aspect-video relative bg-zinc-100">
                {article.thumbnail ? (
                  <Image src={article.thumbnail} alt={article.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 uppercase font-black text-xs">No Thumbnail</div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${article.published ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                    {article.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                <p className="text-xs text-zinc-500 mb-4 flex-1">Tác giả: {article.author.name}</p>
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl gap-2">
                    <Pencil className="w-3.5 h-3.5" /> Sửa
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-xl text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-xl text-blue-500 hover:bg-blue-50">
                    <Globe className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {articles.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border-2 border-dashed">
               Chưa có bài viết nào. Hãy viết bài đầu tiên!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
