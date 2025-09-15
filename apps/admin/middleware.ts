import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authApiRoutePrefix = "/api/auth/";
const publicApiRoutes = ["/api/home"];
const publicRoutes = ["/sign-in"];
const blockedInProd = ["/api/auth/reference"]; // Blocked route

function isAuthApiRoute(pathname: string) {
  return pathname.startsWith(authApiRoutePrefix);
}

export async function middleware(request: NextRequest): Promise<NextResponse | undefined> {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // Block sensitive route in production
  if (blockedInProd.includes(pathname) && process.env.NODE_ENV === "production") {
    return NextResponse.rewrite(new URL("/404", request.url)); // or NextResponse.next() with status 404
  }

  // Allow auth API routes
  if (isAuthApiRoute(pathname)) return NextResponse.next();

  // Allow public API routes
  if (publicApiRoutes.includes(pathname)) return NextResponse.next();

  // Allow public pages without auth
  if (publicRoutes.includes(pathname)) {
    if (sessionCookie) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  // Require auth for everything else
  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.append("callbackUrl", encodeURIComponent(request.url));
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|_static/|favicon.ico|api/trpc).*)"],
};
