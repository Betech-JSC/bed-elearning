"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Save, Image as ImageIcon, Globe } from "lucide-react"
import { Github, Linkedin, Twitter, Youtube } from "@/components/shared/social-icons"
import { Editor } from "@/components/instructor/editor"

interface ProfileFormProps {
  user: {
    name: string | null
    email: string | null
    bio: string | null
    image: string | null
    role?: string | null
    coverImage?: string | null
    portfolioContent?: string | null
    githubUrl?: string | null
    twitterUrl?: string | null
    linkedinUrl?: string | null
    youtubeUrl?: string | null
    websiteUrl?: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const isInstructorOrAdmin = user.role === "INSTRUCTOR" || user.role === "ADMIN"
  
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    image: user.image || "",
    coverImage: user.coverImage || "",
    portfolioContent: user.portfolioContent || "",
    githubUrl: user.githubUrl || "",
    twitterUrl: user.twitterUrl || "",
    linkedinUrl: user.linkedinUrl || "",
    youtubeUrl: user.youtubeUrl || "",
    websiteUrl: user.websiteUrl || ""
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error("Cập nhật thất bại")
      
      await update({ name: formData.name })
      toast.success("Hồ sơ đã được cập nhật thành công!")
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu thông tin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10 max-w-4xl">
      {/* SECTION 1: ACCOUNT & AVATAR / COVER */}
      <div className="space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 border-b pb-2">1. Định danh & Ảnh hồ sơ</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Địa chỉ Email</Label>
            <Input id="email" value={user.email || ""} disabled className="h-14 rounded-2xl border-none bg-[#F8F9FA] px-6 text-sm font-medium opacity-60 cursor-not-allowed" />
            <p className="text-[10px] text-zinc-400 font-medium italic ml-1">Email không thể thay đổi vì lý do bảo mật.</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Họ và Tên</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Họ tên đầy đủ của bạn..."
              className="h-14 rounded-2xl border-none bg-[#F8F9FA] px-6 text-sm font-medium focus-visible:ring-orange-500/20"
            />
          </div>
        </div>

        {/* IMAGE UPLOADS */}
        <div className={isInstructorOrAdmin ? "grid grid-cols-1 md:grid-cols-2 gap-8 pt-4" : "pt-4"}>
          {/* Avatar upload */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Ảnh đại diện (Avatar)</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border bg-zinc-50 flex-shrink-0">
                {formData.image ? (
                  <img src={formData.image} alt="Avatar" className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 font-bold text-xs uppercase bg-zinc-50">No Image</div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatar-image-upload"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="rounded-xl gap-2 h-11 text-xs font-bold border-zinc-200"
                  onClick={() => document.getElementById('avatar-image-upload')?.click()}
                >
                  <ImageIcon className="w-4 h-4" />
                  Thay ảnh đại diện
                </Button>
              </div>
            </div>
          </div>

          {/* Cover image upload */}
          {isInstructorOrAdmin && (
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Ảnh bìa hồ sơ (Cover Image)</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-28 h-20 rounded-2xl overflow-hidden border bg-zinc-50 flex-shrink-0">
                  {formData.coverImage ? (
                    <img src={formData.coverImage} alt="Cover" className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 font-bold text-xs uppercase bg-zinc-50">No Cover</div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="cover-image-upload"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, coverImage: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="rounded-xl gap-2 h-11 text-xs font-bold border-zinc-200"
                    onClick={() => document.getElementById('cover-image-upload')?.click()}
                  >
                    <ImageIcon className="w-4 h-4" />
                    Thay ảnh bìa
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: SOCIAL LINKS */}
      {isInstructorOrAdmin && (
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 border-b pb-2">2. Mạng xã hội & Liên kết cá nhân</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="websiteUrl" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" /> Trang Web Cá Nhân
              </Label>
              <Input 
                id="websiteUrl" 
                value={formData.websiteUrl} 
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://yourwebsite.com"
                className="h-14 rounded-2xl border-none bg-[#F8F9FA] px-6 text-sm font-medium focus-visible:ring-orange-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="githubUrl" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                <Github className="w-3.5 h-3.5" /> Tài khoản GitHub
              </Label>
              <Input 
                id="githubUrl" 
                value={formData.githubUrl} 
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username"
                className="h-14 rounded-2xl border-none bg-[#F8F9FA] px-6 text-sm font-medium focus-visible:ring-orange-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="linkedinUrl" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                <Linkedin className="w-3.5 h-3.5" /> Tài khoản LinkedIn
              </Label>
              <Input 
                id="linkedinUrl" 
                value={formData.linkedinUrl} 
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="h-14 rounded-2xl border-none bg-[#F8F9FA] px-6 text-sm font-medium focus-visible:ring-orange-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="youtubeUrl" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                <Youtube className="w-3.5 h-3.5" /> Kênh YouTube
              </Label>
              <Input 
                id="youtubeUrl" 
                value={formData.youtubeUrl} 
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                placeholder="https://youtube.com/@channel"
                className="h-14 rounded-2xl border-none bg-[#F8F9FA] px-6 text-sm font-medium focus-visible:ring-orange-500/20"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="twitterUrl" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                <Twitter className="w-3.5 h-3.5" /> Tài khoản Twitter / X
              </Label>
              <Input 
                id="twitterUrl" 
                value={formData.twitterUrl} 
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                placeholder="https://x.com/username"
                className="h-14 rounded-2xl border-none bg-[#F8F9FA] px-6 text-sm font-medium focus-visible:ring-orange-500/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: BIO & PORTFOLIO */}
      {isInstructorOrAdmin && (
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 border-b pb-2">3. Tiểu sử ngắn & Trang trí Portfolio (Uy tín)</h3>
          
          <div className="space-y-3">
            <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Tiểu sử ngắn (Bio - Hiển thị nhanh)</Label>
            <Textarea 
              id="bio" 
              value={formData.bio} 
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Mô tả ngắn gọn về bạn và chuyên môn chính của bạn..."
              rows={3}
              className="rounded-[1.5rem] border-none bg-[#F8F9FA] p-6 text-sm font-medium focus-visible:ring-orange-500/20 resize-none"
            />
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-[#FF6600] ml-1">Trang trí Portfolio cá nhân (Rich text)</Label>
            <p className="text-[10px] text-zinc-400 font-medium italic ml-1 mb-2">Thêm thông tin chi tiết về các dự án thực tế, chứng chỉ uy tín, kinh nghiệm làm việc để thúc đẩy doanh số bán khóa học.</p>
            <Editor 
              value={formData.portfolioContent} 
              onChange={(value) => setFormData({ ...formData, portfolioContent: value })} 
            />
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isLoading} className="h-14 px-12 rounded-2xl bg-[#FF6600] hover:bg-orange-600 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20 gap-3 text-white">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isInstructorOrAdmin ? "Lưu hồ sơ Portfolio" : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  )
}
