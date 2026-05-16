import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role

  const isOnAdmin = nextUrl.pathname.startsWith("/admin")
  const isOnInstructor = nextUrl.pathname === "/instructor" || nextUrl.pathname.startsWith("/instructor/")

  // BUG-19 FIX: Consolidate redirect logic. 
  // Let authorized handle the basic "true/false", but handle specific guest redirects here.
  
  if (!isLoggedIn) {
    if (isOnAdmin && nextUrl.pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", nextUrl))
    }
    if (isOnInstructor && nextUrl.pathname !== "/instructor/login") {
      return NextResponse.redirect(new URL("/instructor/login", nextUrl))
    }
  }

  if (isLoggedIn) {
    // Role-based access control
    if (isOnAdmin && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
    if (isOnInstructor && role !== "INSTRUCTOR" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
    
    // Redirect logged-in users away from login pages
    if (nextUrl.pathname === "/admin/login") {
        return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
    }
    if (nextUrl.pathname === "/instructor/login") {
        return NextResponse.redirect(new URL("/instructor/dashboard", nextUrl))
    }
    if (nextUrl.pathname === "/login" || nextUrl.pathname === "/register") {
        return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
