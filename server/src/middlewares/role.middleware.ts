import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";

import { ApiError } from "../utils/apiError";

/**
 * Restricts a route to one or more roles. Must run after `requireAuth`.
 */
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden());
    }
    next();
  };
}
