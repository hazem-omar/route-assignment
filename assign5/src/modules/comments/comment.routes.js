import { Router } from "express";
import {
  createComments,
  updateComment,
  findOrCreateComment,
  searchComments,
  getNewestComments,
} from "./comment.controller.js";

const router = Router();

router.post("/", createComments);
router.post("/find-or-create", findOrCreateComment);
router.get("/search", searchComments);
router.get("/newest/:postId", getNewestComments);
router.patch("/:commentId", updateComment);

export default router;
