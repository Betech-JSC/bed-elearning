import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) {
          return null
        }

        // BUG-25 FIX: Check if user is BANNED
        if (user.status === "BANNED") {
            throw new Error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.")
        }

        // Lockout logic: 5 failed attempts within 15 minutes -> lockout for 30 mins
        if (user.failedAttempts >= 5 && user.lastFailedLogin) {
          const lockedTime = new Date(user.lastFailedLogin.getTime() + 30 * 60 * 1000)
          if (new Date() < lockedTime) {
            throw new Error("Tài khoản đang bị tạm khóa do nhập sai nhiều lần. Vui lòng thử lại sau 30 phút.")
          }
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedAttempts: user.failedAttempts + 1,
              lastFailedLogin: new Date()
            }
          })
          return null
        }

        if (user.failedAttempts > 0) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedAttempts: 0,
              lastFailedLogin: null
            }
          })
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          status: user.status // Pass status to JWT
        }
      }
    })
  ],
})
