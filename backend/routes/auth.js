import expenses from "express";
const routes = expenses.Router();
import User from "../models/auth.js";
import { decryptMessage, encryptMessage } from "../utils/Encryption.js";
import sendMail from "../utils/sendEmail.js";
import router from "./calendar.js";
import jsonwebtoken from 'jsonwebtoken'

routes.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, message: "Username already exists" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .send({ success: false, message: "Email already registered" });
    }
    const hashedPassword = encryptMessage(password);
    const emailVerificationToken = Math.random().toString(36).substring(2, 15);
    const newUser = new User({
      name,
      username,
      email,
      passwordHash: hashedPassword,
      emailVerificationToken,
      isVerified: false,
      emailVerificationExpiry: Date.now() + 3600000,
    });
    await newUser.save();

    await sendMail(
      email,
      "Email Verification - LifeSync",
      `Please verify your email by clicking the following link: ${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`,
    );
    res
      .status(200)
      .cookie("token", jwtToken, {
        httpOnly: true,
        secure: true, // production (https)
        sameSite: "none", // frontend alag domain ho
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Registration successful",
        userId: newUser._id,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in registration" });
  }
});

routes.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid email or password" });
    } else {
      const decryptedPassword = decryptMessage(user.passwordHash);
      if (decryptedPassword !== password) {
        return res
          .status(401)
          .send({ success: false, message: "Invalid email or password" });
      }
    }

    const jwtToken = jsonwebtoken.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "yoursecretkey",
      { expiresIn: "7d" }
    );
    res
      .status(200)
      .cookie("token", jwtToken, {
        httpOnly: true,
        secure: true, // production (https)
        sameSite: "none", // frontend alag domain ho
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        warning:
          "Please verify your email. If you haven't received the verification email, check your spam folder or click on 'Resend Verification Email' on the login page.",
        message: "Login successful",
        userId: user._id,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in login" });
  }
});

routes.route("/email-verify/:verifyToken").get(async (req, res) => {
  try {
    const { verifyToken } = req.params;

    const user = await User.findOne({ emailVerificationToken: verifyToken });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid verification token" });
    }

    if (user.isVerified) {
      return res
        .status(200)
        .send({ success: true, message: "Email already verified" });
    }

    if (user.emailVerificationExpiry < Date.now()) {
      return res
        .status(400)
        .send({ success: false, message: "Verification token has expired" });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    res
      .status(200)
      .send({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in email verification" });
  }
});

routes.route("/get-user/:userId").get(async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    res.status(200).send({ success: true, user: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in fetching user" });
  }
});

router.route("/resend-verification").post(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(200)
        .send({ success: true, message: "Email already verified" });
    }

    const emailVerificationToken = Math.random().toString(36).substring(2, 15);
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpiry = Date.now() + 3600000;
    await user.save();

    await sendMail(
      email,
      "Email Verification - LifeSync",
      `Please verify your email by clicking the following link: ${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`,
    );

    res.status(200).send({
      success: true,
      message: "Verification email resent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in resending verification email",
    });
  }
});

routes.route("/forgot-password").post(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    user.passwordResetToken = resetToken;
    user.passwordResetExpiry = Date.now() + 3600000;
    await user.save();

    await sendMail(
      email,
      "Password Reset - LifeSync",
      `You can reset your password by clicking the following link: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
    );

    res.status(200).send({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in sending password reset email",
    });
  }
});

routes.route("/reset-password/:resetToken").post(async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({ passwordResetToken: resetToken });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Invalid reset token" });
    }

    if (user.passwordResetExpiry < Date.now()) {
      return res
        .status(400)
        .send({ success: false, message: "Reset token has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.passwordHash = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    res
      .status(200)
      .send({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in resetting password" });
  }
});

routes.route("/change-password").post(async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    const decryptedPassword = decryptMessage(user.password);
    if (decryptedPassword !== currentPassword) {
      return res
        .status(401)
        .send({ success: false, message: "Current password is incorrect" });
    }

    const hashedNewPassword = encryptMessage(newPassword);
    user.passwordHash = hashedNewPassword;
    await user.save();

    res
      .status(200)
      .send({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in changing password" });
  }
});

routes.route("/update-profile").post(async (req, res) => {
  try {
    const { userId, name, username } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    user.name = name || user.name;
    user.username = username || user.username;
    await user.save();

    res
      .status(200)
      .send({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in updating profile" });
  }
});

router.route("/delete-account").post(async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .send({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in deleting account" });
  }
});

routes.route("/logout").post(async (req, res) => {
  try {
    // In a real application, you would handle token invalidation here
    res.status(200).send({ success: true, message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in logout" });
  }
});

router.route("verify-reset-token/:resetToken").get(async (req, res) => {
  try {
    const { resetToken } = req.params;
    const user = await User.findOne({ passwordResetToken: resetToken });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Invalid reset token" });
    }

    if (user.passwordResetExpiry < Date.now()) {
      return res
        .status(400)
        .send({ success: false, message: "Reset token has expired" });
    }

    res.status(200).send({ success: true, message: "Reset token is valid" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in verifying reset token" });
  }
});

router.route("verify-email/:verifyToken").get(async (req, res) => {
  try {
    const { verifyToken } = req.params;
    const user = await User.findOne({ emailVerificationToken: verifyToken });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Invalid verification token" });
    }

    if (user.isVerified) {
      return res
        .status(200)
        .send({ success: true, message: "Email already verified" });
    }

    if (user.emailVerificationExpiry < Date.now()) {
      return res
        .status(400)
        .send({ success: false, message: "Verification token has expired" });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    res
      .status(200)
      .send({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in verifying email" });
  }
});

export default routes;
