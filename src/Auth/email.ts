import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", 
  port:2525,
  auth: {
    user: process.env.MAILTRAP_USER!,
    pass: process.env.MAILTRAP_PASS!,
  },
});

export const sendWelcomeEmail = async (to: string, firstName: string) => {
  await transporter.sendMail({
    from: '"Eventify App" <no-reply@eventify.com>',
    to,
    subject: "Welcome to Eventify!",
    html: `<h1>Hello, ${firstName}!</h1><p>Welcome to our platform. We're excited to have you onboard.</p>`,
  });
};

export const sendVerificationEmail = async (to: string, token: string) => {
  const link = `http://localhost:8081/auth/verify/${token}`;

  await transporter.sendMail({
    from: '"Eventify App" <no-reply@eventify.com>',
    to,
    subject: "Verify your email address",
    html: `
      <p>Thanks for signing up!</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${link}">${link}</a>
    `,
  });
};
