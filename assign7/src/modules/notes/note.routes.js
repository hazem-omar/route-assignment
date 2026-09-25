import { Router } from "express";

import {
  createNote,
  updateNote,
  replaceNote,
  updateAllNotes,
  deleteNote,
  getPaginatedNotes,
  getNoteById,
  getNoteByContent,
  getNotesWithUser,
  aggregateNotes,
  deleteAllNotes
} from "./note.controller.js";

const router = Router();

router.post("/", createNote);

router.patch("/all", updateAllNotes);

router.get("/paginate-sort", getPaginatedNotes);

router.get("/note-by-content", getNoteByContent);
router.put("/replace/:noteId", replaceNote);

router.patch("/:noteId", updateNote);

router.delete("/", deleteAllNotes);
router.delete("/:noteId", deleteNote);
router.get("/note-with-user", getNotesWithUser);
router.get("/aggregate", aggregateNotes);
router.get("/:id", getNoteById);

export default router;
