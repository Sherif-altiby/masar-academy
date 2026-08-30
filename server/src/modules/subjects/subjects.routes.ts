import { Request, Response, Router } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { subjectsService } from "./subjects.service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const subjects = await subjectsService.list();
    res.json({ success: true, data: { subjects } });
  })
);

export const subjectsRoutes = router;
