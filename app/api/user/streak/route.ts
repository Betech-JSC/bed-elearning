import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true, lastActivityAt: true }
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Use UTC to calculate days to avoid timezone weirdness across the globe
    const now = new Date()
    const todayStr = now.toISOString().split("T")[0]
    
    let newStreak = user.streak
    let shouldUpdate = false

    if (!user.lastActivityAt) {
      newStreak = 1
      shouldUpdate = true
    } else {
      const lastActivity = new Date(user.lastActivityAt)
      const lastActivityStr = lastActivity.toISOString().split("T")[0]

      if (lastActivityStr !== todayStr) {
        // Compare with yesterday
        const yesterday = new Date()
        yesterday.setDate(now.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split("T")[0]

        if (lastActivityStr === yesterdayStr) {
          // Consecutive day
          newStreak += 1
        } else {
          // Streak broken
          newStreak = 1
        }
        shouldUpdate = true
      }
    }

    if (shouldUpdate) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          streak: newStreak,
          lastActivityAt: now
        }
      })
    }

    return NextResponse.json({ streak: newStreak, isUpdated: shouldUpdate })
  } catch (error) {
    console.error("[STREAK_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
