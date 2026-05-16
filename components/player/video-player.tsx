"use client"

import { useState, useEffect, useRef } from "react"
import MuxPlayer from "@mux/mux-player-react"
import dynamic from "next/dynamic"

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false })

import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useVideoStore } from "@/lib/store/use-video-store"

interface VideoPlayerProps {
  courseId?: string
  lessonId?: string
  videoUrl: string
  initialTime?: number
  onComplete?: () => void
}

export function VideoPlayer({
  courseId,
  lessonId,
  videoUrl,
  initialTime = 0,
  onComplete
}: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false)
  const playerRef = useRef<any>(null)
  
  const { seekTime, setSeekTime, setCurrentTime } = useVideoStore()

  const isYoutube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
  const isMux = !isYoutube && !videoUrl.startsWith("http") // Assuming it's a Mux Playback ID

  // Auto-save progress every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isReady) return
      
      let currentTime = 0
      if (isYoutube) {
        currentTime = playerRef.current?.getCurrentTime() || 0
      } else if (isMux) {
        // Mux player exposes currentTime on the element
        const player = document.querySelector("mux-player") as any
        currentTime = player?.currentTime || 0
      }

      if (currentTime > 0 && courseId && lessonId) {
        try {
          await fetch(`/api/courses/${courseId}/lessons/${lessonId}/progress`, {
            method: "PATCH",
            body: JSON.stringify({ currentTime })
          })
        } catch (error) {
          console.error("Auto-save progress failed", error)
        }
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [isReady, courseId, lessonId, isYoutube, isMux])

  // Track current time continuously for notes sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isReady) return
      
      let time = 0
      if (isYoutube) {
        time = playerRef.current?.getCurrentTime() || 0
      } else if (isMux) {
        const player = document.querySelector("mux-player") as any
        time = player?.currentTime || 0
      }
      setCurrentTime(time)
    }, 1000)

    return () => clearInterval(interval)
  }, [isReady, isYoutube, isMux, setCurrentTime])

  // Handle seeking from notes
  useEffect(() => {
    if (seekTime !== null && isReady) {
      if (isYoutube) {
        playerRef.current?.seekTo(seekTime, "seconds")
      } else if (isMux) {
        const player = document.querySelector("mux-player") as any
        if (player) player.currentTime = seekTime
      }
      setSeekTime(null) // Reset seek time after applying
    }
  }, [seekTime, isReady, isYoutube, isMux, setSeekTime])

  const handleEnded = async () => {
    if (courseId && lessonId) {
      try {
        await fetch(`/api/courses/${courseId}/lessons/${lessonId}/progress`, {
          method: "PATCH",
          body: JSON.stringify({ isCompleted: true })
        })
        toast.success("Bài học đã hoàn thành!")
      } catch (error) {
        toast.error("Không thể cập nhật tiến độ bài học.")
      }
    }
    if (onComplete) onComplete()
  }

  return (
    <div className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
          <Loader2 className="w-12 h-12 animate-spin text-[#FF6600]" />
        </div>
      )}

      {isMux && (
        <MuxPlayer
          playbackId={videoUrl}
          metadata={{
            video_id: lessonId,
            video_title: lessonId,
          }}
          startTime={initialTime}
          onCanPlay={() => setIsReady(true)}
          onEnded={handleEnded}
          className="w-full h-full"
        />
      )}

      {isYoutube && (
        <div className="w-full h-full">
          {/* @ts-ignore */}
          <ReactPlayer
            {...{
              ref: playerRef,
              url: videoUrl,
              width: "100%",
              height: "100%",
              controls: true,
              playing: false,
              onReady: () => {
                setIsReady(true)
                if (initialTime > 0) {
                  playerRef.current?.seekTo(initialTime, "seconds")
                }
              },
              onStart: () => setIsReady(true),
              onEnded: handleEnded
            } as any}
          />
        </div>
      )}

      {!isMux && !isYoutube && (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <p>Định dạng video không được hỗ trợ.</p>
        </div>
      )}
    </div>
  )
}
