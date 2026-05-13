"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VideoPlayer } from "@/components/player/video-player"

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  lessonTitle: string
}

export const PreviewModal = ({
  isOpen,
  onClose,
  videoUrl,
  lessonTitle
}: PreviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none rounded-3xl shadow-2xl">
        <DialogHeader className="p-6 bg-white dark:bg-zinc-950 border-b">
           <DialogTitle className="text-xl font-black flex items-center gap-2">
              <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full">DÙNG THỬ MIỄN PHÍ</span>
              {lessonTitle}
           </DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          <VideoPlayer videoUrl={videoUrl} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
