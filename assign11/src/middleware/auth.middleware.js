import jwt from "jsonwebtoken";
import { redisClient } from "../DB/redis.connection.js";

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token is required",
      });
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded.type !== "access") {
      return res.status(401).json({
        message: "Invalid token type",
      });
    }

    // Check if this session still exists
    const sessionData = await redisClient.get(`session:${decoded.sessionId}`);

    if (!sessionData) {
      return res.status(401).json({
        message: "Session expired or logged out",
      });
    }

    const session = JSON.parse(sessionData);

    if (session.userId !== decoded.userId) {
      return res.status(401).json({
        message: "Invalid session",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
