import { Request, Response } from "express";

import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  clearRefreshCookie,
  readRefreshCookie,
  setRefreshCookie,
} from "./auth.cookies";
import { authService } from "./auth.service";

const CLEAR_COOKIE_CODES = new Set([
  "REFRESH_MISSING",
  "REFRESH_INVALID",
  "REFRESH_EXPIRED",
  "REFRESH_REUSE",
]);

function sessionCode(err: unknown): string | undefined {
  if (!(err instanceof ApiError)) return undefined;
  if (!err.details || typeof err.details !== "object") return undefined;
  const code = (err.details as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.register(
      req.body,
    );

    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      data: { user, accessToken },
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body,
    );

    setRefreshCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      data: { user, accessToken },
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const existingToken = readRefreshCookie(req);

    try {
      const { user, accessToken, refreshToken } =
        await authService.refresh(existingToken);

      setRefreshCookie(res, refreshToken);

      res.status(200).json({
        success: true,
        data: { user, accessToken },
      });
    } catch (err) {
      const code = sessionCode(err);

      // Drop a dead refresh cookie so the client stops replaying it.
      // Do NOT clear on CONCURRENT — a parallel request may have just set a new one.
      if (code && CLEAR_COOKIE_CODES.has(code)) {
        clearRefreshCookie(res);
      }

      throw err;
    }
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const existingToken = readRefreshCookie(req);

    await authService.logout(existingToken);
    clearRefreshCookie(res);

    res.status(200).json({
      success: true,
      data: null,
    });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.me(req.user!.id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.changePassword(
      req.user!.id,
      req.body,
      readRefreshCookie(req),
    );

    res.status(200).json({
      success: true,
      data: null,
      message: "تم تحديث كلمة المرور بنجاح",
    });
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.updateProfile(req.user!.id, req.body);

    res.status(200).json({
      success: true,
      data: { user },
      message: "تم تحديث الملف الشخصي بنجاح",
    });
  }),
};
