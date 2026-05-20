"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2, Globe, Image as ImageIcon, Loader2, Save, X } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Editor } from "@/components/instructor/editor"

interface ArticlesClientProps {
  articles: any[]
}

export const ArticlesClient = ({ articles }: ArticlesClientProps) => {
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    thumbnail: "",
    published: false
  })
  
  const router = useRouter()

  const handleCreateNew = () => {
    setFormData({ title: "", slug: "", content: "", thumbnail: "", published: false })
    setEditingId(null)
    setIsCreating(true)
  }

  const handleEdit = (article: any) => {
    setFormData({
      title: article.title,
      slug: article.slug,
      content: article.content,
      thumbnail: article.thumbnail || "",
      published: article.isPublished
    })
    setEditingId(article.id)
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.")) return

    try {
      setIsLoading(true)
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE"
      })

      if (!res.ok) throw new Error()

      toast.success("Đã xóa bài viết thành công")
      router.refresh()
    } catch {
      toast.error("Có lỗi xảy ra khi xóa bài viết")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      
      const endpoint = editingId 
        ? `/api/admin/articles/${editingId}`
        : "/api/admin/articles"
        
      const method = editingId ? "PATCH" : "POST"

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error()

      toast.success(editingId ? "Đã cập nhật bài viết thành công" : "Đã đăng bài viết mới thành công")
      setIsCreating(false)
      setEditingId(null)
      setFormData({ title: "", slug: "", content: "", thumbnail: "", published: false })
      router.refresh()
    } catch {
      toast.error("Có lỗi xảy ra khi lưu bài viết")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {!isCreating && (
          <Button onClick={handleCreateNew} className="rounded-2xl bg-blue-600 hover:bg-blue-700 h-12 px-6 gap-2 text-sm font-bold text-white shadow-lg shadow-blue-500/10">
            <PlusCircle className="w-4 h-4" />
            Viết bài mới
          </Button>
        )}
      </div>

      {isCreating ? (
        <div className="bg-white dark:bg-zinc-950 border rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              {editingId ? "Chỉnh sửa bài viết" : "Viết bài mới"}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)} className="rounded-xl">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Tiêu đề bài viết</label>
              <input 
                className="w-full bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                placeholder="VD: Hướng dẫn học Next.js 15"
                value={formData.title}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  title: e.target.value, 
                  slug: e.target.value
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/đ/g, "d")
                    .replace(/Đ/g, "d")
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-")
                    .trim()
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Slug (URL)</label>
              <input 
                className="w-full bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                placeholder="huong-dan-hoc-nextjs-15"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Ảnh bìa bài viết (Thumbnail)</label>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input 
                  className="flex-1 bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  placeholder="Dán link ảnh hoặc tải lên tệp..."
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="blog-thumbnail-upload"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setFormData({ ...formData, thumbnail: reader.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="rounded-xl gap-2 h-11 shrink-0 px-4"
                    onClick={() => document.getElementById("blog-thumbnail-upload")?.click()}
                  >
                    <ImageIcon className="w-4 h-4" />
                    Tải lên
                  </Button>
                </div>
              </div>
              {formData.thumbnail && (
                <div className="relative aspect-video w-64 rounded-2xl overflow-hidden border shadow-sm bg-zinc-50">
                  <img src={formData.thumbnail} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Nội dung bài viết</label>
            <Editor 
              value={formData.content} 
              onChange={(value) => setFormData({ ...formData, content: value })} 
            />
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-5 h-5 rounded-lg border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="published" className="text-sm font-black text-zinc-700 dark:text-zinc-300 cursor-pointer selection:bg-transparent">
              Xuất bản ngay bài viết này
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button onClick={() => setIsCreating(false)} variant="ghost" className="rounded-xl px-6 h-12 text-sm font-bold">
              Hủy
            </Button>
            <Button 
              onClick={onSubmit} 
              disabled={isLoading || !formData.title || !formData.content} 
              className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8 h-12 text-sm font-bold gap-2 text-white"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu bài viết
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-video relative bg-zinc-50 dark:bg-zinc-900">
                {article.thumbnail ? (
                  <Image src={article.thumbnail} alt={article.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 uppercase font-black text-[10px] tracking-widest bg-zinc-50 dark:bg-zinc-900">Chưa có ảnh bìa</div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white ${article.isPublished ? "bg-emerald-500" : "bg-amber-500"}`}>
                    {article.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1 space-y-4">
                <h3 className="text-lg font-black text-zinc-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">{article.title}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tác giả: {article.author?.name || "Belearning Team"}</p>
                <div className="flex items-center gap-2 pt-6 border-t border-zinc-50 dark:border-zinc-900 mt-auto">
                  <Button onClick={() => handleEdit(article)} variant="outline" size="sm" className="flex-1 rounded-2xl gap-2 h-11 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900">
                    <Pencil className="w-3.5 h-3.5" /> Sửa
                  </Button>
                  <Button onClick={() => handleDelete(article.id)} variant="ghost" size="icon" className="rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 h-11 w-11">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button asChild variant="ghost" size="icon" className="rounded-2xl text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 h-11 w-11">
                    <a href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {articles.length === 0 && (
            <div className="col-span-full py-20 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
               Chưa có bài viết nào. Hãy viết bài viết đầu tiên để làm sinh động trang web!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
