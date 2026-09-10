import { Router } from "express";

import {
  signup,
  updateUser,
  getUserByEmail,
  getUserById,
} from "./user.controller.js";

const router = Router();

router.post("/signup", signup);

router.put("/:id", updateUser);

router.get("/by-email", getUserByEmail);

router.get("/:id", getUserById);

export default router;
