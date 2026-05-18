"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { chatStore } from "@/lib/chat-store"
import { Button } from "@/components/ui/button"

interface MessageButtonProps {
  instructorId: string
  instructorName: string
  instructorImage?: string
}

export function MessageButton({ instructorId, instructorName, instructorImage }: MessageButtonProps) {
  const { status } = useSession()
  const router = useRouter()

  const handleMessageClick = () => {
    if (status === "unauthenticated") {
      toast.error("Vui lòng đăng nhập để gửi tin nhắn cho giảng viên.")
      router.push(`/login?callbackUrl=/instructors/${instructorId}`)
      return
    }

    if (status === "loading") {
      return
    }

    // Open floating chat box
    chatStore.openChat(instructorId, instructorName, instructorImage)
  }

  return (
    <Button 
      onClick={handleMessageClick}
      className="w-full h-16 rounded-2xl bg-[#FF6600] hover:bg-orange-600 font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20 mt-8 gap-3 text-white border-none cursor-pointer active:scale-[0.98] transition-all"
    >
      <MessageSquare className="w-4 h-4" />
      Gửi tin nhắn
    </Button>
  )
}
