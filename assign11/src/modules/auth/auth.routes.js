import { Router } from "express";

import {
  register,
  login,
  refreshToken,
  logout,
  logoutSpecificSession,
  logoutAllDevices,
  getSessions,
  verifyEmail,
  resendEmailOTP,
  forgetPassword,
  resetPassword,
} from "./auth.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", auth, logout);
router.get("/sessions", auth, getSessions);

router.delete("/sessions/:sessionId", auth, logoutSpecificSession);

router.delete("/sessions", auth, logoutAllDevices);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendEmailOTP);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
export default router;
