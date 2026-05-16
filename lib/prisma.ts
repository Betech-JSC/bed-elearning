import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

  // Auto-retry on Neon cold start (P1001 = can't reach DB server)
  return client.$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        const MAX_RETRIES = 3
        const RETRY_DELAY = 1000

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          try {
            return await query(args)
          } catch (err: any) {
            const isConnectionError =
              err?.code === "P1001" ||
              err?.message?.includes("Can't reach database") ||
              err?.message?.includes("Connection refused")

            if (isConnectionError && attempt < MAX_RETRIES) {
              console.warn(
                `[Prisma] DB connection failed (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${RETRY_DELAY * (attempt + 1)}ms...`
              )
              await new Promise((res) =>
                setTimeout(res, RETRY_DELAY * (attempt + 1))
              )
              continue
            }
            throw err
          }
        }
      },
    },
  })
}

type PrismaClientExtended = ReturnType<typeof createPrismaClient>

const globalForPrismaExtendedV2 = globalThis as unknown as {
  prisma: PrismaClientExtended | undefined
}

export const prisma =
  globalForPrismaExtendedV2.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production")
  globalForPrismaExtendedV2.prisma = prisma

export default prisma
