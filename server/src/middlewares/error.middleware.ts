import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

import { ApiError } from "../utils/apiError";
import { env } from "../config/env";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `المسار ${req.method} ${req.originalUrl} غير موجود`,
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "هذا العنصر موجود بالفعل",
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "العنصر المطلوب غير موجود",
      });
    }
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    message: "حدث خطأ غير متوقع في الخادم",
    stack: env.NODE_ENV === "development" && err instanceof Error ? err.stack : undefined,
  });
}
