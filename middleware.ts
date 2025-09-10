import { getSessionCookie } from "better-auth/cookies"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const adminRoutes = ["/dashboard", "/dashboard/quizzes", "/dashboard/settings"]
const adminPublicRoutes = ["/sign-in"]
// const publicRoutes = ["/", "/quiz"]
const authApiRoutePrefix = "/api/auth/"

function isAuthApiRoute(pathname: string): boolean {
  return pathname.startsWith(authApiRoutePrefix)
}

export async function middleware(request: NextRequest): Promise<NextResponse | undefined> {
  const { pathname } = request.nextUrl
  const host = request.headers.get("host") || ""
  const isAdminDomain =
    host.startsWith("admin.") ||
    host.startsWith("admin.localhost") ||
    host.startsWith("admin.127.0.0.1")

  const sessionCookie = getSessionCookie(request)

  // Block /api/auth/reference in production
  if (pathname.startsWith("/api/auth/reference") && process.env.NODE_ENV !== "development") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // 🌍 Public domain
  if (!isAdminDomain) {
    // redirect /sign-in on public to /
    if (pathname === "/sign-in") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Block admin routes on public domain
    if (adminRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
  }

  // 🔐 Admin domain
  if (isAuthApiRoute(pathname)) return NextResponse.next()

  // Redirect root "/" to /dashboard if signed in
  if (pathname === "/" && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Admin public routes (like /sign-in)
  if (adminPublicRoutes.includes(pathname) ) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.next()
  }

  // Only allow specific admin routes
  if (!adminRoutes.includes(pathname) && !pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // All allowed admin routes require auth
  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.append("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/|_static/|favicon.ico|api/trpc).*)"],
}
