import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTE_PREFIXES = [
  "/courses",
  "/profile",
  "/teacher/dashboard",
];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get("masar_refresh_token")?.value;
  if (refreshToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/courses/:path*",
    "/profile/:path*",
    "/teacher/dashboard/:path*",
  ],
};