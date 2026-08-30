import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { uploadImage, uploadPdf } from "../../config/upload";
import { createCourseSchema } from "../courses/courses.validation";
import { teacherConsoleController } from "./teacherConsole.controller";
import { createLessonSchema, upsertQuizSchema } from "./teacherConsole.validation";

const router = Router();

router.use(requireAuth, requireRole("TEACHER"));

router.get("/profile", teacherConsoleController.getProfile);
router.get("/courses", teacherConsoleController.listCourses);
router.post(
  "/courses",
  validate({ body: createCourseSchema }),
  teacherConsoleController.createCourse
);
router.get("/courses/:slug", teacherConsoleController.getCourse);
router.post(
  "/courses/:slug/lessons",
  validate({ body: createLessonSchema }),
  teacherConsoleController.createLesson
);

router.post(
  "/lessons/:lessonId/pdf",
  uploadPdf.single("pdf"),
  teacherConsoleController.attachPdf
);

router.get("/lessons/:lessonId/quiz", teacherConsoleController.getLessonQuiz);
router.put(
  "/lessons/:lessonId/quiz",
  validate({ body: upsertQuizSchema }),
  teacherConsoleController.upsertQuiz
);

router.post(
  "/uploads/image",
  uploadImage.single("image"),
  teacherConsoleController.uploadImage
);

export const teacherConsoleRoutes = router;
