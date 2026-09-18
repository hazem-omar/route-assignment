import { db } from "../../DB/connection.js";

export const createBooksCollection = async (req, res) => {
  try {
    await db.createCollection("books", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: {
            title: {
              bsonType: "string",
              minLength: 1,
            },
          },
        },
      },
    });

    res.status(201).json({ ok: 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create books collection",
      error: error.message,
    });
  }
};
export const createAuthor = async (req, res) => {
  try {
    const result = await db.collection("authors").insertOne({
      name: "Author1",
      nationality: "British",
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create author",
      error: error.message,
    });
  }
};

export const createLogsCollection = async (req, res) => {
  try {
    await db.createCollection("logs", {
      capped: true,
      size: 1048576,
    });

    res.status(201).json({ ok: 1 });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create logs collection",
      error: error.message,
    });
  }
};
export const createBooksTitleIndex = async (req, res) => {
  try {
    const result = await db.collection("books").createIndex({
      title: 1,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create books title index",
      error: error.message,
    });
  }
};
