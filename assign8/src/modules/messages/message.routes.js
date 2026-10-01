import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { sendMessage } from "./message.controller.js";

const router = Router();

router.post("/", auth, sendMessage);

export default router;
