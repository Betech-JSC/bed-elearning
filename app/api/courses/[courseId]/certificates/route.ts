import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { createAuditLog } from "@/lib/audit-log"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()
    const { courseId } = await params

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId
        }
      }
    })

    if (!enrollment) {
      return new NextResponse("Not enrolled", { status: 403 })
    }

    // Check if certificate already exists
    const existingCert = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId
        }
      }
    })

    if (existingCert) {
      return NextResponse.json(existingCert)
    }

    const certificate = await prisma.certificate.create({
      data: {
        userId: session.user.id,
        courseId
      }
    })

    await createAuditLog(
      session.user.id,
      "CERTIFICATE_ISSUED",
      certificate.id,
      "CERTIFICATE",
      { courseId, certificateId: certificate.certificateId }
    )

    return NextResponse.json(certificate)
  } catch (error) {
    console.error("[CERTIFICATE_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
