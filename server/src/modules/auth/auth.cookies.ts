import { CookieOptions, Response } from "express";

import { env, isProduction } from "../../config/env";
import { parseDurationToMs } from "../../utils/jwt";

const REFRESH_TOKEN_TTL_MS = parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN);

/**
 * Refresh token lives in an httpOnly cookie scoped to /api/auth so it is
 * never readable by JS and is only sent to login/refresh/logout endpoints.
 * Access tokens stay in memory on the client (Authorization: Bearer).
 */
export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/api/auth",
  maxAge: REFRESH_TOKEN_TTL_MS,
};

export function setRefreshCookie(res: Response, token: string) {
  res.cookie("masar_refresh_token", token, refreshCookieOptions);
}

/** clearCookie must reuse the same path/sameSite/secure flags used to set it. */
export function clearRefreshCookie(res: Response) {
  res.clearCookie("masar_refresh_token", {
    httpOnly: refreshCookieOptions.httpOnly,
    secure: refreshCookieOptions.secure,
    sameSite: refreshCookieOptions.sameSite,
    path: refreshCookieOptions.path,
  });
}

export function readRefreshCookie(req: {
  cookies?: Record<string, string>;
}): string | undefined {
  const value = req.cookies?.["masar_refresh_token"];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}
