import { User } from "../../DB/models/user.model.js";
import { redisClient } from "../../DB/redis.connection.js";
import { generateTokenPair } from "../../utils/token.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  sendEmailOTP,
  sendPasswordResetOTP,
} from "../../services/otp.service.js";
const SESSION_TTL = 7 * 24 * 60 * 60;

const createUserSession = async (userId, req) => {
  const tokens = generateTokenPair(userId.toString());

  const sessionData = {
    userId: userId.toString(),
    refreshJti: tokens.refreshJti,
    device: req.get("user-agent") || "Unknown Device",
    ip: req.ip,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  };

  await redisClient.set(
    `session:${tokens.sessionId}`,
    JSON.stringify(sessionData),
    { EX: SESSION_TTL },
  );

  // Add session ID to the user's sessions list
  const userSessionsKey = `user:sessions:${userId}`;

  await redisClient.sAdd(userSessionsKey, tokens.sessionId);
  await redisClient.expire(userSessionsKey, SESSION_TTL);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Send email verification OTP
    await sendEmailOTP(normalizedEmail);
console.log("OTP email sent successfully to:", normalizedEmail);
    return res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailConfirmed: user.isEmailConfirmed,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    if (!user.isEmailConfirmed) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const tokens = await createUserSession(user._id, req);

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      ...tokens,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: oldRefreshToken } = req.body;

    if (!oldRefreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    // 1. Verify the old refresh token
    let decoded;

    try {
      decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    // 2. Check token type
    if (decoded.type !== "refresh") {
      return res.status(401).json({
        message: "Invalid token type",
      });
    }

    // 3. Get session from Redis
    const sessionData = await redisClient.get(`session:${decoded.sessionId}`);

    if (!sessionData) {
      return res.status(401).json({
        message: "Session not found or expired",
      });
    }

    const session = JSON.parse(sessionData);

    // 4. Check refresh token ID
    if (
      session.userId !== decoded.userId ||
      session.refreshJti !== decoded.jti
    ) {
      return res.status(401).json({
        message: "Refresh token has already been used",
      });
    }

    // 5. Generate new token pair using the same session ID
    const tokens = generateTokenPair(decoded.userId, decoded.sessionId);

    // 6. Update session data in Redis
    const updatedSession = {
      ...session,
      refreshJti: tokens.refreshJti,
      lastActiveAt: new Date().toISOString(),
    };

    await redisClient.set(
      `session:${tokens.sessionId}`,
      JSON.stringify(updatedSession),
      { EX: SESSION_TTL },
    );

    // 7. Add session to user's sessions list
    const userSessionsKey = `user:sessions:${decoded.userId}`;

    await redisClient.sAdd(userSessionsKey, tokens.sessionId);

    await redisClient.expire(userSessionsKey, SESSION_TTL);

    return res.status(200).json({
      message: "Tokens refreshed successfully",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
// logout
export const logout = async (req, res) => {
  try {
    const { sessionId, userId } = req.user;

    await redisClient.del(`session:${sessionId}`);

    await redisClient.sRem(`user:sessions:${userId}`, sessionId);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getSessions = async (req, res) => {
  try {
    const { userId, sessionId: currentSessionId } = req.user;

    const userSessionsKey = `user:sessions:${userId}`;

    const sessionIds = await redisClient.sMembers(userSessionsKey);

    const sessions = [];

    for (const id of sessionIds) {
      const sessionData = await redisClient.get(`session:${id}`);

      if (!sessionData) {
        await redisClient.sRem(userSessionsKey, id);
        continue;
      }

      const session = JSON.parse(sessionData);

      if (session.userId !== userId) {
        await redisClient.sRem(userSessionsKey, id);
        continue;
      }

      sessions.push({
        sessionId: id,
        device: session.device,
        ip: session.ip,
        createdAt: session.createdAt,
        lastActiveAt: session.lastActiveAt,
        current: id === currentSessionId,
      });
    }

    return res.status(200).json({
      message: "Sessions retrieved successfully",
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("Get Sessions Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// logout specific device
export const logoutSpecificSession = async (req, res) => {
  try {
    const { userId } = req.user;
    const { sessionId } = req.params;

    const sessionKey = `session:${sessionId}`;

    const sessionData = await redisClient.get(sessionKey);

    if (!sessionData) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    const session = JSON.parse(sessionData);

    // Make sure this session belongs to the logged-in user
    if (session.userId !== userId) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    await redisClient.del(sessionKey);

    await redisClient.sRem(`user:sessions:${userId}`, sessionId);

    return res.status(200).json({
      message: "Session logged out successfully",
    });
  } catch (error) {
    console.error("Logout Specific Session Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Logout from All Devices
export const logoutAllDevices = async (req, res) => {
  try {
    const { userId } = req.user;

    const userSessionsKey = `user:sessions:${userId}`;

    const sessionIds = await redisClient.sMembers(userSessionsKey);

    for (const sessionId of sessionIds) {
      await redisClient.del(`session:${sessionId}`);
    }

    await redisClient.del(userSessionsKey);

    return res.status(200).json({
      message: "Logged out from all devices successfully",
      revokedSessions: sessionIds.length,
    });
  } catch (error) {
    console.error("Logout All Devices Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};




export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isEmailConfirmed) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    // Get OTP from Redis
    const otpKey = `email:otp:${normalizedEmail}`;
    const savedOTP = await redisClient.get(otpKey);

    if (!savedOTP) {
      return res.status(400).json({
        message: "OTP expired or not found. Please request a new one.",
      });
    }

    // Compare OTP
    if (savedOTP !== String(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Confirm user email
    user.isEmailConfirmed = true;
    await user.save();

    // Delete OTP after successful verification
    await redisClient.del(otpKey);

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify Email Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const resendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isEmailConfirmed) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    // Generate and send a new OTP
    await sendEmailOTP(normalizedEmail);

    return res.status(200).json({
      message: "A new OTP has been sent to your email",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
      isEmailConfirmed: true,
    });

    // Use the same response whether the account exists or not
    if (user) {
      await sendPasswordResetOTP(normalizedEmail);
    }

    return res.status(200).json({
      message:
        "If the account exists, a password reset code has been sent to your email.",
    });
  } catch (error) {
    console.error("Forget Password Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};    

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    // 1. Validate required fields
    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Find confirmed user
    const user = await User.findOne({
      email: normalizedEmail,
      isEmailConfirmed: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 3. Get OTP from Redis
    const otpKey = `password:otp:${normalizedEmail}`;

    const savedOTP = await redisClient.get(otpKey);

    if (!savedOTP) {
      return res.status(400).json({
        message: "OTP expired or not found",
      });
    }

    // 4. Verify OTP
    if (savedOTP !== String(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // 5. Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    // 6. Delete used OTP
    await redisClient.del(otpKey);

    // 7. Revoke all active sessions
    const userSessionsKey = `user:sessions:${user._id}`;

    const sessionIds = await redisClient.sMembers(userSessionsKey);

    for (const sessionId of sessionIds) {
      await redisClient.del(`session:${sessionId}`);
    }

    await redisClient.del(userSessionsKey);

    return res.status(200).json({
      message: "Password reset successfully. Please login again.",
      revokedSessions: sessionIds.length,
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};




