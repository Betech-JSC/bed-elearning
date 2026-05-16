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
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("An error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-2xl">
      <div className="space-y-3">
        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</Label>
        <Input id="email" value={user.email || ""} disabled className="h-14 rounded-2xl border-none bg-[#F8F9FA] px-6 text-sm font-medium opacity-60 cursor-not-allowed" />
        <p className="text-[10px] text-zinc-400 font-medium italic ml-1">Email cannot be changed for security reasons.</p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</Label>
        <Input 
          id="name" 
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your full name..."
          className="h-14 rounded-2xl border-none bg-[#F8F9FA] px-6 text-sm font-medium focus-visible:ring-orange-500/20"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Biography</Label>
        <Textarea 
          id="bio" 
          value={formData.bio} 
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us a bit about yourself..."
          rows={6}
          className="rounded-[1.5rem] border-none bg-[#F8F9FA] p-6 text-sm font-medium focus-visible:ring-orange-500/20 resize-none"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="h-14 px-10 rounded-2xl bg-[#FF6600] hover:bg-orange-600 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20 gap-3">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        Save Changes
      </Button>
    </form>
  )
}
