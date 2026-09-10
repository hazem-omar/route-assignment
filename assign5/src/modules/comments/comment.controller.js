import Comment from "../../DB/models/comment.model.js";
import { Op } from "sequelize";
export const createComments = async (req, res) => {
  try {
    const { comments } = req.body;

    await Comment.bulkCreate(comments);

    return res.status(201).json({
      message: "Comments created successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, userId } = req.body;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found.",
      });
    }

    if (comment.userId !== Number(userId)) {
      return res.status(403).json({
        message: "Unauthorized.",
      });
    }

    comment.content = content;

    await comment.save();

    return res.status(200).json({
      message: "Comment updated successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const findOrCreateComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;

    const [comment, created] = await Comment.findOrCreate({
      where: {
        postId,
        userId,
        content,
      },
      defaults: {
        postId,
        userId,
        content,
      },
    });

    return res.status(200).json({
      comment,
      created,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const searchComments = async (req, res) => {
  try {
    const { word } = req.query;

    const result = await Comment.findAndCountAll({
      where: {
        content: {
          [Op.like]: `%${word}%`,
        },
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        message: "no comments found",
      });
    }

    return res.status(200).json({
      count: result.count,
      comments: result.rows,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const getNewestComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: {
        postId,
      },
      order: [["createdAt", "DESC"]],
      limit: 3,
    });

    if (comments.length === 0) {
      return res.status(404).json({
        message: "no comments found",
      });
    }

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
