"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

interface ProfileFormProps {
  user: {
    name: string | null
    email: string | null
    bio: string | null
    image: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || ""
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error("Cập nhật thất bại")
      
      await update({ name: formData.name })
      toast.success("Đã cập nhật thông tin thành công!")
    } catch (error) {
      toast.error("Đã có lỗi xảy ra.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="email">Địa chỉ Email</Label>
        <Input id="email" value={user.email || ""} disabled className="bg-zinc-50 dark:bg-zinc-900/50" />
        <p className="text-[10px] text-zinc-500 italic">Email không thể thay đổi vì lý do bảo mật.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Họ và tên</Label>
        <Input 
          id="name" 
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nhập họ và tên của bạn..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Tiểu sử</Label>
        <Textarea 
          id="bio" 
          value={formData.bio} 
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Giới thiệu ngắn gọn về bản thân..."
          rows={5}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="gap-2 bg-blue-600 hover:bg-blue-700">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Lưu thay đổi
      </Button>
    </form>
  )
}
