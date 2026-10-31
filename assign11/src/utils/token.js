import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

export const generateTokenPair = (userId, sessionId = randomUUID()) => {
  const refreshJti = randomUUID();

  const accessToken = jwt.sign(
    { userId, sessionId, type: "access" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { userId, sessionId, type: "refresh", jti: refreshJti },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  return {
    accessToken,
    refreshToken,
    sessionId,
    refreshJti,
  };
};
