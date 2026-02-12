const bcryptjs = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Register a new user
const newUserFunction = async (req, res) => {
  try {
    // Extracting user details from the request body
    const { name, username, email, password } = req.body;

    // Check username available or not
    const isUsernameAvailable = await User.findOne({ username });
    if (isUsernameAvailable) {
      return res.status(400).json({
        success: false,
        message: "Username already exist",
      });
    }
    // Check email available or not
    const isEmailAvailable = await User.findOne({ email });
    if (isEmailAvailable) {
      return res.status(400).json({
        success: false,
        message: "Email already exist",
      });
    }

    const emailVerificationToken = crypto
      .getRandomValues(new Uint8Array(32))
      .toString("hex");
    const emailVerificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Creating a new user
    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
      name,
      username,
      email,
      emailVerificationToken,
      emailVerificationTokenExpires,
      password: hashPassword,
    });

    // Sending email verification
    await sendEmail(email, emailVerificationToken);

    // Responding with success message
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    // Logging the error and responding with a server error message
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Login user function
const loginUserFunction = async (req, res) => {
  try {
    // Extracting email and password from the request body
    const { email, password } = req.body;
    // Finding the user by email
    const user = await User.findOne({ email });
    // If user not found, respond with an error message
    if (!user) {
      return res
        .status(400)
        .json({ success: false, response: "Invalid credentials" });
    }
    // Comparing the provided password with the stored hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    // If the password is invalid, respond with an error message
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    // Generating a JWT token for the authenticated user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // Setting the token in a cookie and responding with user details
    res.cookie("token", token);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    // Logging the error and responding with a server error message
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// Logout user function
const logoutFunction = async (req, res) => {
  try {
    req.clearCookie("token");
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Email verification function
const verifyEmailFunction = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const reSendEmailVerificationFunction = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email already verified" });
    }
    const emailVerificationToken = crypto
      .getRandomValues(new Uint8Array(32))
      .toString("hex");
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();
    await sendEmail(email, emailVerificationToken);
    res.status(200).json({
      success: true,
      message: "Verification email resent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  newUser: newUserFunction,
  login: loginUserFunction,
  logout: logoutFunction,
  verifyEmail: verifyEmailFunction,
  reSendEmailVerification: reSendEmailVerificationFunction,
};

// Helper function to send email verification
async function sendEmail(email, emailVerificationToken) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `http://localhost:8080/auth/verify-email?token=${emailVerificationToken}`;

  (async () => {
    const info = await transporter.sendMail({
      from: `"LifeSync " <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Verify Your Email",
      text: `
Hi,

Please verify your email by clicking the link below:
${verificationLink}

If you didn’t create this account, you can ignore this email.
  `,
      html: `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
    <h3>Verify Your Email</h3>
    <p>Please confirm your email address to continue.</p>
    
    <a href="${verificationLink}" 
      style="display: inline-block; padding: 10px 20px; 
              background-color: #4f46e5; color: #ffffff; 
              text-decoration: none; border-radius: 5px;">
      Verify Email
    </a>

    <p style="margin-top: 15px; font-size: 12px; color: #777;">
      If you didn’t create this account, just ignore this email.
    </p>
  </div>
  `,
    });
  })().catch(console.error);
}
