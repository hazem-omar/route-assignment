import { db } from "../../DB/connection.js";

export const addBook = async (req, res) => {
  try {
    const result = await db.collection("books").insertOne(req.body);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add book",
      error: error.message,
    });
  }
};

export const addBooks = async (req, res) => {
  try {
    const result = await db.collection("books").insertMany(req.body);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add books",
      error: error.message,
    });
  }
};
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
export const updateBook = async (req, res) => {
  try {
    const result = await db
      .collection("books")
      .updateOne({ title: req.params.title }, { $set: { year: 2022 } });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update book",
      error: error.message,
    });
  }
};
export const getBookByTitle = async (req, res) => {
  try {
    const book = await db.collection("books").findOne({
      title: req.query.title,
    });

    res.status(200).json(book);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to find book",
      error: error.message,
    });
  }
};
export const getBooksByYear = async (req, res) => {
  try {
    const from = Number(req.query.from);
    const to = Number(req.query.to);

    const books = await db
      .collection("books")
      .find({
        year: {
          $gte: from,
          $lte: to,
        },
      })
      .toArray();

    res.status(200).json(books);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to find books by year",
      error: error.message,
    });
  }
};
export const getBooksByGenre = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .find({
        genres: req.query.genre,
      })
      .toArray();

    res.status(200).json(books);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to find books by genre",
      error: error.message,
    });
  }
};
export const getBooksWithSkipLimit = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .find()
      .sort({ year: -1 })
      .skip(2)
      .limit(3)
      .toArray();

    res.status(200).json(books);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get books",
      error: error.message,
    });
  }
};
export const getBooksWithIntegerYear = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .find({
        year: {
          $type: "int",
        },
      })
      .toArray();

    res.status(200).json(books);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to find books with integer year",
      error: error.message,
    });
  }
};
export const getBooksExcludeGenres = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .find({
        genres: {
          $nin: ["Horror", "Science Fiction"],
        },
      })
      .toArray();

    res.status(200).json(books);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to find books excluding genres",
      error: error.message,
    });
  }
};
export const deleteBooksBeforeYear = async (req, res) => {
  try {
    const year = Number(req.query.year);

    const result = await db.collection("books").deleteMany({
      year: {
        $lt: year,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete books",
      error: error.message,
    });
  }
};
export const aggregateBooks1 = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .aggregate([
        {
          $match: {
            year: {
              $gt: 2000,
            },
          },
        },
        {
          $sort: {
            year: -1,
          },
        },
      ])
      .toArray();

    res.status(200).json(books);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to aggregate books",
      error: error.message,
    });
  }
};
export const aggregateBooks2 = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .aggregate([
        {
          $match: {
            year: {
              $gt: 2000,
            },
          },
        },
        {
          $project: {
            _id: 0,
            title: 1,
            author: 1,
            year: 1,
          },
        },
      ])
      .toArray();

    res.status(200).json(books);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to aggregate books",
      error: error.message,
    });
  }
};
export const aggregateBooks3 = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .aggregate([
        {
          $unwind: "$genres",
        },
      ])
      .toArray();

    res.status(200).json(books);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to aggregate books",
      error: error.message,
    });
  }
};
export const aggregateBooks4 = async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .aggregate([
        {
          $lookup: {
            from: "logs",
            let: {
              bookId: {
                $toString: "$_id",
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$book_id", "$$bookId"],
                  },
                },
              },
            ],
            as: "logs",
          },
        },
      ])
      .toArray();

    res.status(200).json(books);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to aggregate books with logs",
      error: error.message,
    });
  }
};

