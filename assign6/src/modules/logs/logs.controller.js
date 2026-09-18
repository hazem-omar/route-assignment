import { db } from "../../DB/connection.js";

export const addLog = async (req, res) => {
  try {
    const result = await db.collection("logs").insertOne(req.body);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add log",
      error: error.message,
    });
  }
};
