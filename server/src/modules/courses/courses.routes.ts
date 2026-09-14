import { Request, Response, Router } from "express";

import { attachUserIfPresent } from "../../middlewares/auth.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
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
  attachUserIfPresent,
  asyncHandler(async (req: Request, res: Response) => {
    const course = await coursesService.getBySlug(String(req.params.slug), req.user?.id);
    res.json({ success: true, data: { course } });
  })
);

router.post(
  "/:slug/enroll",
  requireAuth,
  requireRole("STUDENT"),
  asyncHandler(async (req: Request, res: Response) => {
    const enrollment = await coursesService.enroll(req.user!.id, String(req.params.slug));
    res.status(201).json({ success: true, data: { enrollment } });
  })
);

export const coursesRoutes = router;
