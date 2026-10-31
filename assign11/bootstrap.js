import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./src/DB/db.connection.js";

import authRoutes from "./src/modules/auth/auth.routes.js";
import userRoutes from "./src/modules/users/user.routes.js";
import messageRoutes from "./src/modules/messages/message.routes.js";
import { connectRedis } from "./src/DB/redis.connection.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));
// Connect to MongoDB
await connectDB();

// Connect to Redis
await connectRedis();

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Saraha App is running",
  });
});

export default app;
