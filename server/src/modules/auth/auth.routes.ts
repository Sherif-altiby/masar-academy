import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import { authRateLimiter } from "../../middlewares/rateLimit.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate({ body: registerSchema }),
  authController.register
);
router.post(
  "/login",
  authRateLimiter,
  validate({ body: loginSchema }),
  authController.login
);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

export const authRoutes = router;
