import { Model, DataTypes } from "sequelize";
import sequelize from "../connection.js";

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING,
    },

    content: {
      type: DataTypes.TEXT,
    },

    userId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "Post",
    paranoid: true,
  },
);

export default Post;
