import Post from "../../DB/models/post.model.js";
import User from "../../DB/models/user.model.js";
import Comment from "../../DB/models/comment.model.js";
import { Sequelize } from "sequelize";

export const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const post = new Post({
      title,
      content,
      userId,
    });

    await post.save();

    return res.status(201).json({
      message: "Post created successfully.",
      post,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    if (post.userId !== Number(userId)) {
      return res.status(403).json({
        message: "Unauthorized.",
      });
    }

    await post.destroy();

    return res.status(200).json({
      message: "Post deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const getPostsDetails = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title"],

      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
        {
          model: Comment,
          attributes: ["id", "content"],
        },
      ],
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const getPostsCommentCount = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        [Sequelize.fn("COUNT", Sequelize.col("Comments.id")), "commentCount"],
      ],
      include: [
        {
          model: Comment,
          attributes: [],
        },
      ],
      group: ["Post.id", "Post.title"],
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
