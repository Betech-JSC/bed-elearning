"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function StreakUpdater() {
  const router = useRouter()

  useEffect(() => {
    fetch("/api/user/streak", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        if (data.isUpdated) {
          // Refresh the page data if streak was updated so the sidebar shows the new streak
          router.refresh()
        }
      })
      .catch(console.error)
  }, [router])

  return null
}
