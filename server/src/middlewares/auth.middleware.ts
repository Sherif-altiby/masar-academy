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
