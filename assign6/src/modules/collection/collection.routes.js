import express from "express";

import {
  createBooksCollection,
  createAuthor,
  createLogsCollection,
  createBooksTitleIndex,
} from "./collection.controller.js";

const router = express.Router();

router.post("/books", createBooksCollection);

router.post("/authors", createAuthor);

router.post("/logs/capped", createLogsCollection);

router.post("/books/index", createBooksTitleIndex);

export default router;
