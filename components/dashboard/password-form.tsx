"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, KeyRound, ShieldCheck } from "lucide-react"

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp")
    }

    if (formData.newPassword.length < 8) {
      return toast.error("Mật khẩu mới phải có ít nhất 8 ký tự")
    }

    try {
      setIsLoading(true)
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Cập nhật thất bại")
      
      toast.success("Đổi mật khẩu thành công!")
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-2xl">
      <div className="space-y-3">
        <Label htmlFor="currentPassword" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Mật khẩu hiện tại</Label>
        <div className="relative">
            <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
                id="currentPassword" 
                type="password"
                required
                value={formData.currentPassword} 
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="h-14 rounded-2xl border-none bg-[#F8F9FA] pl-14 pr-6 text-sm font-medium focus-visible:ring-orange-500/20"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
            <Label htmlFor="newPassword" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Mật khẩu mới</Label>
            <Input 
                id="newPassword" 
                type="password"
                required
                value={formData.newPassword} 
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Tối thiểu 8 ký tự"
                className="h-14 rounded-2xl border-none bg-[#F8F9FA] px-6 text-sm font-medium focus-visible:ring-orange-500/20"
            />
        </div>

        <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Xác nhận mật khẩu</Label>
            <Input 
                id="confirmPassword" 
                type="password"
                required
                value={formData.confirmPassword} 
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Nhập lại mật khẩu mới"
                className="h-14 rounded-2xl border-none bg-[#F8F9FA] px-6 text-sm font-medium focus-visible:ring-orange-500/20"
            />
        </div>
      </div>

      <div className="p-6 border border-blue-50 bg-blue-50/30 rounded-[2rem] flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex flex-col gap-1">
            <span className="font-black uppercase tracking-widest text-[10px] text-blue-600">Gợi ý bảo mật</span>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Hãy sử dụng mật khẩu khác biệt với các ứng dụng khác và tránh sử dụng thông tin cá nhân như ngày sinh hay số điện thoại.
            </p>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="h-14 px-10 rounded-2xl bg-zinc-900 hover:bg-black transition-all font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-zinc-200 gap-3">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5" />}
        Cập nhật mật khẩu
      </Button>
    </form>
  )
}
