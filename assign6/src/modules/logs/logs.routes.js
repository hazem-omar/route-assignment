import express from "express";
import { addLog } from "./logs.controller.js";

const router = express.Router();

router.post("/", addLog);

export default router;
