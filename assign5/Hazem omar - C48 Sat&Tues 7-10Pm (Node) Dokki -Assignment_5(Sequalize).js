import express from "express";
import sequelize from "./src/DB/connection.js";
import "./src/DB/associations.js";
import userRouter from "./src/modules/users/user.routes.js";
import postRouter from "./src/modules/posts/post.routes.js";
import commentRouter from "./src/modules/comments/comment.routes.js";
const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
const server = async () => {
  try {
    await sequelize.authenticate();
      await sequelize.sync();  
      console.log("Database synchronized successfully.");  
    console.log("Database connected successfully.");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

server();
