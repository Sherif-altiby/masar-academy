import { Request, Response, Router } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { coursesService } from "./courses.service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const subjectId = typeof req.query.subject === "string" ? req.query.subject : undefined;
    const teacherId = typeof req.query.teacher === "string" ? req.query.teacher : undefined;
    const courses = await coursesService.list({ subjectId, teacherId });
    res.json({ success: true, data: { courses } });
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req: Request, res: Response) => {
    const course = await coursesService.getBySlug(String(req.params.slug));
    res.json({ success: true, data: { course } });
  })
);

export const coursesRoutes = router;
