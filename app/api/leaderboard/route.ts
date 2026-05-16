import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const topUsers = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        xp: { gt: 0 } // Only show users who have started learning
      },
      orderBy: [
        { xp: "desc" },
        { streak: "desc" }
      ],
      take: 10,
      select: {
        id: true,
        name: true,
        image: true,
        xp: true,
        streak: true
      }
    })

    return NextResponse.json(topUsers)
  } catch (error) {
    console.error("[LEADERBOARD_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
