import { Router } from "express";

import {
  createPost,
  deletePost,
  getPostsDetails,
  getPostsCommentCount,
} from "./post.controller.js";

const router = Router();

router.post("/", createPost);

router.get("/details", getPostsDetails);

router.get("/comment-count", getPostsCommentCount);

router.delete("/:postId", deletePost);

export default router;
