const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/user.model");

router.post("/", async (req, res) => {
  const { name, username, email, password } = req.body;
  const secret = "secret";
  const salt = crypto.randomBytes(16).toString("hex");
  const hashPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512");

  const newUser = new User({
    name,
    username,
    email,
    password: hashPassword,
    salt,
  });
  await newUser.save();

  res.send("hello");
});

module.exports = router;
