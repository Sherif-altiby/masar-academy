import { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/apiError";
import { verifyAccessToken } from "../utils/jwt";

/**
 * Requires a valid access token in the `Authorization: Bearer <token>` header.
 * On success, attaches `{ id, role }` to `req.user`.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("يجب تسجيل الدخول للوصول إلى هذا المورد"));
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(ApiError.unauthorized("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى"));
  }
}

/**
 * Like requireAuth, but does not fail the request if no/invalid token is
 * present — useful for endpoints that behave differently for logged-in users
 * without requiring authentication (e.g. public course listing).
 */
export function attachUserIfPresent(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    const token = header.slice("Bearer ".length);
    try {
      const payload = verifyAccessToken(token);
      req.user = { id: payload.sub, role: payload.role };
    } catch {
      // ignore invalid token — request proceeds unauthenticated
    }
  }
  next();
}

const PUBLIC_API_ROUTES = new Set([
  "GET /api/health",
  "GET /api/subjects",
  "GET /api/teachers",
  "POST /api/auth/register",
  "POST /api/auth/login",
  "POST /api/auth/refresh",
  "POST /api/auth/logout",
]);

function isPublicApiRequest(req: Request): boolean {
  if (req.method === "OPTIONS") return true;

  const route = `${req.method} ${req.path.replace(/\/$/, "")}`;
  return (
    PUBLIC_API_ROUTES.has(route) ||
    (req.method === "GET" && req.path.startsWith("/api/teachers/"))
  );
}

/**
 * Protects the API by default while leaving public browsing and session
 * bootstrap endpoints available without an access token.
 */
export function requireApiAuth(req: Request, res: Response, next: NextFunction) {
  if (isPublicApiRequest(req)) return next();
  return requireAuth(req, res, next);
}
