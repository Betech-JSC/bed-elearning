import prisma from "@/lib/prisma"

export const createAuditLog = async (
  userId: string | null,
  action: string,
  entityId: string,
  entityType: string,
  details: any = null
) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityId,
        entityType,
        details
      }
    })
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR]", error)
  }
}
