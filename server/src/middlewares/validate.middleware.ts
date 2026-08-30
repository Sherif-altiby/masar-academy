import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

import { ApiError } from "../utils/apiError";

interface ValidationSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

/**
 * Validates req.body / req.params / req.query against the given zod schemas
 * and replaces them with the parsed (and thus type-coerced/defaulted) values.
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
      if (schemas.query) req.query = schemas.query.parse(req.query) as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(ApiError.badRequest("بيانات غير صحيحة", error.flatten().fieldErrors));
      } else {
        next(error);
      }
    }
  };
}
