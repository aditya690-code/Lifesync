import expenses from "express";

const routes = expenses.Router();

import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "../models/auth.js";

const sendMail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL || "adityaofficial690@gmail.com",
        pass: process.env.PASS || "tqjdfrggddixvlos",
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL || "adityaofficial690@gmail.com",
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (err) {
    console.error(`Error sending email to ${email}:`, err);
  }
};

export default sendMail;
