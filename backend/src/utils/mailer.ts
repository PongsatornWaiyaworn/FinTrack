import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `"FinTrack" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your OTP Verification Code",
    html: `
      <h2>Verify your email</h2>
      <p>Your OTP code is:</p>
      <h1>${otp}</h1>
      <p>This code will expire in 5 minutes.</p>
    `,
  });
}
