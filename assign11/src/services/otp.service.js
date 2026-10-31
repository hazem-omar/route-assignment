import { randomInt } from "node:crypto";
import { redisClient } from "../DB/redis.connection.js";
import { sendEmail } from "./email.service.js";

const OTP_TTL = 5 * 60; // 5 minutes

export const sendEmailOTP = async (email) => {
  const otp = randomInt(100000, 1000000).toString();

  const otpKey = `email:otp:${email}`;

  try {
    console.log("Generated OTP");

    await redisClient.set(otpKey, otp, {
      EX: OTP_TTL,
    });

    console.log("OTP saved in Redis");

    const info = await sendEmail({
      to: email,
      subject: "Saraha App - Email Verification",
      html: `
        <h2>Welcome to Saraha App!</h2>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 5 minutes.</p>
      `,
    });

    console.log("Email accepted:", info.accepted);

    return true;
  } catch (error) {
    await redisClient.del(otpKey);
    console.error("OTP Sending Error:", error);
    throw error;
  }
};

export const sendPasswordResetOTP = async (email) => {
  const otp = randomInt(100000, 1000000).toString();

  const otpKey = `password:otp:${email}`;

  try {
    await redisClient.set(otpKey, otp, {
      EX: OTP_TTL,
    });

    await sendEmail({
      to: email,
      subject: "Saraha App - Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset Request</h2>
          <p>Your password reset code is:</p>
          <h1 style="letter-spacing: 5px;">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    await redisClient.del(otpKey);
    throw error;
  }
};

