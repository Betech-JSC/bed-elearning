"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trophy, Star, ArrowRight } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CourseCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  courseTitle: string
}

export function CourseCompletionModal({
  isOpen,
  onClose,
  courseTitle
}: CourseCompletionModalProps) {
  useEffect(() => {
    if (isOpen) {
      const duration = 5 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
      }, 250)
      
      return () => clearInterval(interval)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center p-12">
        <div className="mx-auto w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-yellow-600 dark:text-yellow-500" />
        </div>
        
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-center">Chúc mừng bạn!</DialogTitle>
          <DialogDescription className="text-lg text-zinc-600 dark:text-zinc-400 mt-2">
            Bạn đã hoàn thành xuất sắc khoá học <br />
            <span className="font-bold text-zinc-900 dark:text-white">&quot;{courseTitle}&quot;</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-8 space-y-4">
          <p className="text-sm text-zinc-500">Hãy chia sẻ cảm nhận của bạn về khoá học nhé!</p>
          <div className="flex flex-col gap-3">
            <Button className="h-12 text-md font-bold bg-blue-600 hover:bg-blue-700">
              <Star className="w-4 h-4 mr-2" />
              Viết đánh giá
            </Button>
            <Link 
              href="/my-courses" 
              className={cn(buttonVariants({ variant: "outline" }), "h-12 text-md font-bold")}
              onClick={onClose}
            >
              Quay về khoá học của tôi
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
