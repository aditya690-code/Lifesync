const crypto = require("crypto");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Register a new user
const newUserFunction = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, response: "Username already exists" });
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists)
      return res
        .status(400)
        .json({ success: false, response: "Email already exists" });

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    const newUser = new User({
      name,
      username,
      email,
      salt,
      password: passwordHash,
    });

    await newUser.save();
    res
      .status(201)

      .json({ success: true, response: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, response: "Internal server error" });
  }
};

const loginUserFunction = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, response: "Invalid username or password" });
  }

  const passwordHash = crypto
    .pbkdf2Sync(password, user.salt, 1000, 64, "sha512")
    .toString("hex");

  if (passwordHash !== user.password) {
    return res
      .status(400)
      .json({ success: false, response: "Invalid username or password" });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: "1h",
    },
  );

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json({ success: true, response: "Login successful" });
};

module.exports = {
  newUser: newUserFunction,
  login: loginUserFunction,
};
