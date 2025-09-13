import { getSessionCookie } from "better-auth/cookies"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const authApiRoutePrefix = "/api/auth/"
const publicRoutes = ["/sign-in"]

function isAuthApiRoute(pathname: string): boolean {
  return pathname.startsWith(authApiRoutePrefix)
}

export async function middleware(request: NextRequest): Promise<NextResponse | undefined> {
  const { pathname } = request.nextUrl
  const sessionCookie = getSessionCookie(request)

  // Allow auth API routes
  if (isAuthApiRoute(pathname)) return NextResponse.next()

  // Allow public routes (like /sign-in) without auth
  if (publicRoutes.includes(pathname)) {
    if (sessionCookie) {
      // If already signed in, redirect to home
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Require auth for everything else
  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.append("callbackUrl", encodeURIComponent(request.url))
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/|_static/|favicon.ico|api/trpc).*)"],
}
