import mongoose from "mongoose";

export const connectDB = async () => {
  try {
      await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, {
        serverSelectionTimeoutMS: 5000, // Set a timeout for server selection
    });

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
