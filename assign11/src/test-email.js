import "dotenv/config";
import { sendEmail } from "./services/email.service.js";

try {
  await sendEmail({
    to: process.env.EMAIL_USER,
    subject: "Saraha App - Email Test",
    html: "<h2>Hello!</h2><p>Nodemailer is working successfully.</p>",
  });

  console.log("Email sent successfully!");
} catch (error) {
  console.error("Email sending failed:", error);
}
