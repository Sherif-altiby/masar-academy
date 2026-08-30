import { Request, Response, Router } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { teachersService } from "./teachers.service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const subjectId = typeof req.query.subject === "string" ? req.query.subject : undefined;
    const teachers = await teachersService.list(subjectId);
    res.json({ success: true, data: { teachers } });
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req: Request, res: Response) => {
    const teacher = await teachersService.getBySlug(String(req.params.slug));
    res.json({ success: true, data: { teacher } });
  })
);

export const teachersRoutes = router;
