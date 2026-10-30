import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const protectedRoutes = [
  "/beranda",
  "/buat-postingan",
  "/kalender",
  "/postingan",
  "/media",
  "/analitik",
  "/akun-sosmed",
  "/pengaturan",
]

const authRoutes = ["/masuk", "/daftar"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/masuk", req.url))
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/beranda", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
}
