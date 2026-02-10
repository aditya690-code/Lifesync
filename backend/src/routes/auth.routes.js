const express = require("express");
const User = require("../models/user.model");
const crypto = require("crypto");
const router = express.Router();
const { newUser, login } = require("../controllers/auth.controller");
const wrapAsync = require("../utils/wrapAsync");

// Login user
router.post("/login", wrapAsync(login));

// Register a new user
router.post("/register", wrapAsync(newUser));

module.exports = router;
