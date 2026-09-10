import { Model, DataTypes } from "sequelize";
import sequelize from "../connection.js";

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    content: {
      type: DataTypes.TEXT,
    },

    postId: {
      type: DataTypes.INTEGER,
    },

    userId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "Comment",
  },
);

export default Comment;
