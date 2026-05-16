import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string, lessonId: string, noteId: string }> }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { noteId } = await params

    const note = await prisma.note.findUnique({
      where: { id: noteId }
    })

    if (!note || note.userId !== userId) {
      return new NextResponse("Unauthorized or Not Found", { status: 401 })
    }

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    })

    return new NextResponse("Deleted", { status: 200 })
  } catch (error) {
    console.error("[NOTE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
