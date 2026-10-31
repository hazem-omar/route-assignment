import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

// Listen for Redis errors
redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

// Connect to Redis
export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis connected successfully");
  }
};
