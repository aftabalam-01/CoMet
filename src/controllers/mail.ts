import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sentResetEmail = async (data: EmailData): Promise<void> => {
  if (!data.to || !data.subject || (!data.text && !data.html)) {
    throw new Error("Missing required email fields");
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"CoMet" <${process.env.MAIL_ID}}>`,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });

  console.log("Mail sent to:", info.accepted);
};
