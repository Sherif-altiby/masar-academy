import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];

const PROTECTED_ROUTES = [
  "/courses",
  "/profile",
  "/teacher",
];

interface JwtPayload {
  sub?: string;
  tokenId?: string;
  role?: string;
  exp?: number;
}

function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenValid(payload: JwtPayload | null): boolean {
  if (!payload) return false;
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    return false;
  }
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const rawToken = request.cookies.get("masar_refresh_token")?.value;
  const payload = rawToken ? parseJwtPayload(rawToken) : null;
  const isAuthenticated = isTokenValid(payload);
  const userRole = isAuthenticated ? payload?.role : null;

  // 1. مسارات المصادقة (تسجيل الدخول والتسجيل)
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAuthRoute) {
    if (isAuthenticated) {
      // توجيه المستخدم حسب دوره إذا كان مسجل دخول بالفعل
      const redirectUrl =
        userRole === "TEACHER" ? "/teacher/dashboard" : "/profile";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // 2. التحقق من المسارات المحمية
  const isProtected = PROTECTED_ROUTES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // إذا لم يكن مسجل دخول، يتم توجيهه لصفحة الدخول مع حفظ المسار المطلوب
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  // 3. توجيه وصلاحيات المعلم
  const isTeacherRoute = pathname.startsWith("/teacher");
  if (isTeacherRoute && userRole !== "TEACHER") {
    // مستخدم مسجل لكنه ليس معلماً (طالب مثلاً) -> إعادة توجيهه للصفحة الرئيسية
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/courses/:path*",
    "/profile/:path*",
    "/teacher/:path*",
  ],
};