import express from "express";
import { connectDB } from "./src/DB/connection.js";
import collectionRoutes from "./src/modules/collection/collection.routes.js";
import booksRoutes from "./src/modules/books/books.routes.js";
import logsRoutes from "./src/modules/logs/logs.routes.js";
const app = express();

app.use(express.json());
app.use("/collection", collectionRoutes);
app.use("/books", booksRoutes);
app.use("/logs", logsRoutes);
await connectDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
