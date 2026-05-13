import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [], 
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // BUG-19 FIX: Trả về true để Middleware tự xử lý redirect cụ thể cho /admin/login và /instructor/login.
      // Nếu trả về false ở đây, NextAuth sẽ ép user về /login (mặc định), gây xung đột với middleware.
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.status = (user as any).status // Pass status to token
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
        (session.user as any).status = token.status as string
      }
      return session
    }
  }
} satisfies NextAuthConfig
