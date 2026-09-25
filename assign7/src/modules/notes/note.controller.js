import mongoose from "mongoose";
import { Note } from "../../DB/models/Note.js";
export const createNote = async (req, res) => {
  try {
    const { userId } = req.query;
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      userId,
    });

    return res.status(201).json({
      message: "Note created",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.query;
    const { title, content } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You are not the owner",
      });
    }

    if (title !== undefined) {
      note.title = title;
    }

    if (content !== undefined) {
      note.content = content;
    }

    await note.save();

    return res.status(200).json({
      message: "updated",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const replaceNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.query;
    const { title, content } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You are not the owner",
      });
    }

    note.title = title;
    note.content = content;

    await note.save();

    return res.status(200).json({
      message: "Note replaced",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const updateAllNotes = async (req, res) => {
  try {
    const { userId } = req.query;
    const { title } = req.body;

    const result = await Note.updateMany({ userId }, { $set: { title } });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "No note found",
      });
    }

    return res.status(200).json({
      message: "All notes updated",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.query;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You are not the owner",
      });
    }

    await Note.findByIdAndDelete(noteId);

    return res.status(200).json({
      message: "delete",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getPaginatedNotes = async (req, res) => {
  try {
    const { userId, page = 1, limit = 3 } = req.query;

    const skip = (page - 1) * limit;

    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You are not the owner",
      });
    }

    return res.status(200).json({
      note,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getNoteByContent = async (req, res) => {
  try {
    const { content, userId } = req.query;

    const note = await Note.findOne({
      content,
      userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "No note found",
      });
    }

    return res.status(200).json({
      note,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getNotesWithUser = async (req, res) => {
  try {
    const { userId } = req.query;

    const notes = await Note.find({ userId })
      .select("title userId createdAt")
      .populate("userId", "email");

    return res.status(200).json({
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const aggregateNotes = async (req, res) => {
  try {
    const { title, userId } = req.query;

    const notes = await Note.aggregate([
      {
        $match: {
          title,
          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          createdAt: 1,
          user: {
            name: "$user.name",
            email: "$user.email",
          },
        },
      },
    ]);

    return res.status(200).json({
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteAllNotes = async (req, res) => {
  try {
    const { userId } = req.query;

    await Note.deleteMany({ userId });

    return res.status(200).json({
      message: "Deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

