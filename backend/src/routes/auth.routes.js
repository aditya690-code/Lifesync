const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth.controller");
const wrapAsync = require("../utils/wrapAsync");
const authMiddleware = require("../middleware/authValidation.js");

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

router.post("/logout", wrapAsync(authControllers.logout));

router.get("/verify-email", wrapAsync(authControllers.verifyEmail));
router.post(
  "/send-email-verification-email",
  wrapAsync(authControllers.reSendEmailVerification),
);

module.exports = router;
