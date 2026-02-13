const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth.controller");
const wrapAsync = require("../utils/wrapAsync");
const authMiddleware = require("../middleware/authValidation.middleware.js");
const { isUserLogin } = require("../middleware/auth.middleware");

// Check username available or not
router.post("/username-available", authControllers.checkUsername);

// Login user
router.post(
  "/login",
  authMiddleware.loginValidationRules,
  wrapAsync(authControllers.login),
);

// Register a new user
router.post(
  "/register",
  authMiddleware.registerValidationRules,
  wrapAsync(authControllers.newUser),
);

// Logout route
router.post("/logout", isUserLogin, wrapAsync(authControllers.logout));

// Is User logged in or not
router.get("/me", isUserLogin, authControllers.isUserLoggedIn);

// router.post("/forgot-password", );

// router.post("/change-password", isUserLogin);

// Send Emial verification token
router.post(
  "/send-email-verification-token",
  isUserLogin,
  wrapAsync(authControllers.reSendEmailVerification),
);

// Verify email token
router.get("/verify-email/:token", wrapAsync(authControllers.verifyEmail));

module.exports = router;
