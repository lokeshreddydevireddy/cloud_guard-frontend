import { Router } from "express";
import * as ctrl from "../controllers/auth.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.post("/refresh", ctrl.refresh);
router.post("/logout", ctrl.logout);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password", ctrl.resetPassword);
router.post("/verify-email", ctrl.verifyEmail);
router.post("/resend-verification", requireAuth, ctrl.resendVerification);
router.get("/profile", requireAuth, ctrl.profile);
router.put("/profile", requireAuth, ctrl.updateProfile);

export default router;
