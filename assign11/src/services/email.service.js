import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  // Create transporter when sending, after dotenv is loaded
  const transporter = createTransporter();

  return await transporter.sendMail({
    from: `"Saraha App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
