import express from "express";
import userRouter from "./modules/users/user.routes.js";
import noteRouter from "./modules/notes/note.routes.js";

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/notes", noteRouter);

export default app;
