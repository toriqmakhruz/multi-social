import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isProtected && !sessionToken) {
    const loginUrl = new URL("/masuk", req.url)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && sessionToken) {
    const homeUrl = new URL("/beranda", req.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
}
