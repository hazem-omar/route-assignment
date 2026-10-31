import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { getProfile } from "./user.controller.js";
import { upload } from "../../middleware/upload.middleware.js";
import { updateProfilePicture } from "./user.controller.js";
const router = Router();

router.get("/profile", auth, getProfile);
router.patch(
  "/profile-picture",
  auth,
  upload.array("profilePicture",5),
  updateProfilePicture,
);
export default router;
