"use client"

import { useEffect, useState } from "react"
import { ReviewModal } from "./review-modal"
import { toast } from "sonner"
import { PartyPopper } from "lucide-react"

interface CompletionHandlerProps {
  courseId: string
  isCompleted: boolean
}

export const CompletionHandler = ({
  courseId,
  isCompleted
}: CompletionHandlerProps) => {
  const [showModal, setShowModal] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    if (isCompleted && !hasShown) {
      const shown = localStorage.getItem(`review_shown_${courseId}`)
      if (!shown) {
        setShowModal(true)
        localStorage.setItem(`review_shown_${courseId}`, "true")
        setHasShown(true)
        toast("Chúc mừng! Bạn đã hoàn thành khóa học!", {
          icon: <PartyPopper className="w-5 h-5 text-blue-600" />,
          duration: 5000
        })
      }
    }
  }, [isCompleted, courseId, hasShown])

  return (
    <ReviewModal 
      courseId={courseId}
      isOpen={showModal}
      onClose={() => setShowModal(false)}
    />
  )
}
