import { Request, Response, Router } from "express";

import { attachUserIfPresent, requireAuth } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { lessonsService } from "./lessons.service";
import { submitQuizAttemptSchema } from "./lessons.validation";

const router = Router();

router.get(
  "/:id",
  attachUserIfPresent,
  asyncHandler(async (req: Request, res: Response) => {
    const lesson = await lessonsService.getById(String(req.params.id), req.user!.id);
    res.json({ success: true, data: { lesson } });
  })
);

router.post(
  "/:id/complete",
  requireAuth,
  requireRole("STUDENT"),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await lessonsService.complete(req.user!.id, String(req.params.id));
    res.json({ success: true, data: result });
  })
);

router.get(
  "/:id/quiz",
  requireAuth,
  requireRole("STUDENT"),
  asyncHandler(async (req: Request, res: Response) => {
    const quiz = await lessonsService.getQuizForTaking(String(req.params.id), req.user!.id);
    res.json({ success: true, data: { quiz } });
  })
);

router.post(
  "/:id/quiz/attempts",
  requireAuth,
  requireRole("STUDENT"),
  validate({ body: submitQuizAttemptSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await lessonsService.submitQuizAttempt(
      req.user!.id,
      String(req.params.id),
      req.body
    );
    res.json({ success: true, data: result });
  })
);

export const lessonsRoutes = router;
