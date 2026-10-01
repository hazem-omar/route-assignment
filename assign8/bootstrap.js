import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./src/DB/db.connection.js";

import authRoutes from "./src/modules/auth/auth.routes.js";
import userRoutes from "./src/modules/users/user.routes.js";
import messageRoutes from "./src/modules/messages/message.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

await connectDB();

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Saraha App is running",
  });
});

export default app;
