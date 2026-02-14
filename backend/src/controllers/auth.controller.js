const bcryptjs = require("bcryptjs");
const User = require("../models/user.model");
const UsernameReservation = require("../models/usernameReservation.model");
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

    const emailVerificationCode = crypto.randomInt(100000, 1000000).toString();
    const emailVerificationCodeExpires = Date.now() + 10 * 60; // 10 min

    // Creating a new user
    const hashPassword = await bcryptjs.hash(password, 10);
    const hashCode = await bcryptjs.hash(emailVerificationCode, 10);
    const newUser = await User.create({
      name,
      username,
      email,
      emailVerificationCode: hashCode,
      emailVerificationCodeExpires,
      password: hashPassword,
    });

    // Sending email verification
    await sendOTP(email, emailVerificationCode);
    const isUsernameReserve = UsernameReservation.findOne({ username });

    if (isUsernameReserve) {
      UsernameReservation.findByIdAndDelete({ _id: isUsernameReserve._id });
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.cookie("token", token);
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Setting the token in a cookie and responding with user details
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

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
    res.clearCookie("token");
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
    const { otp } = req.body;
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.id });

    const isCodeValid = bcryptjs.compare(otp, user.emailVerificationCode);

    if (!isCodeValid) {
      const newOtp = crypto.randomInt(100000, 1000000).toString();
      await sendEmail(user.email, newOtp);
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationCodeExpires = undefined;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
// Sending email verification token
const reSendEmailVerificationFunction = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ _id: userId });
    const email = user.email;
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
    const emailVerificationToken = crypto.randomInt(100000, 1000000).toString();
    user.emailVerificationCode = emailVerificationToken;
    user.emailVerificationCodeExpires = Date.now() + 10 * 60; //10 min
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

// Check username exist or not
const checkUsername = async (req, res) => {
  const { username } = req.body;
  const isUser = await User.findOne({ username });

  if (isUser) {
    return res.status(409).json({
      success: false,
      message: "Username already taken",
    });
  }

  const isUserReserve = await UsernameReservation.findOne({ username });
  if (isUserReserve) {
    return res.status(409).json({
      success: false,
      message: "Username already taken",
    });
  }

  await UsernameReservation.create({ username });

  res.status(201).json({
    success: true,
    message: "Username Available",
  });
};
//
const isUserLoggedIn = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    res.status(200).json({
      success: true,
      message: "User logged in",
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Exports all function
module.exports = {
  newUser: newUserFunction,
  login: loginUserFunction,
  logout: logoutFunction,
  verifyEmail: verifyEmailFunction,
  reSendEmailVerification: reSendEmailVerificationFunction,
  checkUsername,
  isUserLoggedIn,
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

async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  (async () => {
    const info = await transporter.sendMail({
      from: `"LifeSync " <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Verify Your Email",
      text: `
        Hi,
        Your One-Time Password (OTP) for verification is: ${otp}
        This OTP is valid for 10 minutes.
        If you did not request this, please ignore this email.

        Thanks,
        LifeSync Team
`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px;">
            
            <h2 style="text-align: center; color: #333;">Verify Your Email</h2>
            
            <p>Hi,</p>
            
            <p>Your One-Time Password (OTP) for verification is:</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 28px; letter-spacing: 5px; font-weight: bold; color: #4CAF50;">
                ${otp}
              </span>
            </div>
            
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            
            <p>If you did not request this, please ignore this email.</p>
            
            <p style="margin-top: 30px;">Thanks,<br/>LifeSync</p>
            
          </div>
        </div>
        `,
    });
  })().catch(console.error);
}
