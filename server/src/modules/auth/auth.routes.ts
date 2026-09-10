import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import {
  authRateLimiter,
  refreshRateLimiter,
} from "../../middlewares/rateLimit.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { authController } from "./auth.controller";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "./auth.validation";

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
router.post("/refresh", refreshRateLimiter, authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);
router.patch(
  "/profile",
  requireAuth,
  validate({ body: updateProfileSchema }),
  authController.updateProfile
);
router.post(
  "/change-password",
  requireAuth,
  authRateLimiter,
  validate({ body: changePasswordSchema }),
  authController.changePassword
);

export const authRoutes = router;
