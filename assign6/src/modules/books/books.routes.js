import express from "express";
import {
  addBook,
  addBooks,
  addLog,
  updateBook,
  getBookByTitle,
  getBooksByYear,
  getBooksByGenre,
  getBooksWithSkipLimit,
  getBooksWithIntegerYear,
  getBooksExcludeGenres,
  deleteBooksBeforeYear,
  aggregateBooks1,
  aggregateBooks2,
  aggregateBooks3,
  aggregateBooks4,
} from "./books.controller.js";

const router = express.Router();

router.post("/", addBook);
router.post("/batch", addBooks);
router.patch("/:title", updateBook);
router.post("/logs", addLog);
router.get("/title", getBookByTitle);
router.get("/year", getBooksByYear);
router.get("/genre", getBooksByGenre);
router.get("/skip-limit", getBooksWithSkipLimit);
router.get("/year-integer", getBooksWithIntegerYear);
router.get("/exclude-genres", getBooksExcludeGenres);
router.delete("/before-year", deleteBooksBeforeYear); 
router.get("/aggregate1", aggregateBooks1);
router.get("/aggregate2", aggregateBooks2);
router.get("/aggregate3", aggregateBooks3); 
router.get("/aggregate4", aggregateBooks4);
export default router;  
