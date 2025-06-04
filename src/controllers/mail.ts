import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sentResetEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const data: EmailData = req.body;

    if (!data.to || !data.subject || (!data.text && !data.html)) {
      res.status(400).json({ message: "Missing required email fields" });
      return;
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
    res
      .status(200)
      .json({ message: "Reset Email Sent", accepted: info.accepted });
  }
);
