import { Router } from "express";

import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/auth.controller.js";

import {
  loginSchema,
  registerSchema,
} from "../validators/auth.validator.js";

import {
  validate,
} from "../middleware/validate.middleware.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { UserRole } from "../types/user.types.js";

const router = Router();

router.post(
  "/register",

  validate(registerSchema),

  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.post(
  "/refresh",
  refresh
);
router.get(
  "/me",
  authenticate,

  (req, res) => {
    res.status(200).json({
      success: true,

      data: {
        user: req.user,
      },
    });
  }
);
router.get(
  "/admin",

  authenticate,

  authorize(UserRole.ADMIN),

  (_req, res) => {
    res.status(200).json({
      success: true,

      message:
        "Welcome Admin",
    });
  }
);

router.post(
  "/logout",
  logout
);

export default router;