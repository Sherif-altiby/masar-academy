import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { teacherConsoleController } from "./teacherConsole.controller";

const router = Router();

router.use(requireAuth, requireRole("TEACHER"));

router.get("/courses", asyncHandler(teacherConsoleController.listCourses));
router.get("/courses/:slug", asyncHandler(teacherConsoleController.getCourse));

export const teacherConsoleRoutes = router;
