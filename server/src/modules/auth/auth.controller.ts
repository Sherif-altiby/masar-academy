import { Request, Response } from "express";

import { env } from "../../config/env";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService, refreshCookieOptions } from "./auth.service";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, token, refreshCookieOptions);
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, { path: refreshCookieOptions.path });
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ success: true, data: { user, accessToken } });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(200).json({ success: true, data: { user, accessToken } });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const existingToken = req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME];
    const { user, accessToken, refreshToken } = await authService.refresh(existingToken);
    setRefreshCookie(res, refreshToken);
    res.status(200).json({ success: true, data: { user, accessToken } });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const existingToken = req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME];
    await authService.logout(existingToken);
    clearRefreshCookie(res);
    res.status(200).json({ success: true, data: null });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.me(req.user!.id);
    res.status(200).json({ success: true, data: { user } });
  }),
};
