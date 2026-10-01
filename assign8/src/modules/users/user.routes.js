import { Router } from "express";
import { register, login } from "../auth/auth.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { getProfile } from "./user.controller.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
export default router;
