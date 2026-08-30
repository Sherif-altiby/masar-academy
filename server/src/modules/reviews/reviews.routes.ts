import { Request, Response, Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { reviewsService } from "./reviews.service";
import { submitReviewSchema } from "./reviews.validation";

const router = Router();

router.use(requireAuth, requireRole("STUDENT"));

router.post(
  "/teachers/:teacherId",
  validate({ body: submitReviewSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const review = await reviewsService.rateTeacher(
      req.user!.id,
      String(req.params.teacherId),
      req.body
    );
    res.status(201).json({ success: true, data: { review } });
  })
);

router.post(
  "/platform",
  validate({ body: submitReviewSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const review = await reviewsService.ratePlatform(req.user!.id, req.body);
    res.status(201).json({ success: true, data: { review } });
  })
);

router.get(
  "/teachers/mine",
  asyncHandler(async (req: Request, res: Response) => {
    const reviews = await reviewsService.myTeacherReviews(req.user!.id);
    res.json({ success: true, data: { reviews } });
  })
);

export const reviewsRoutes = router;
