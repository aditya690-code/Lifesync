const express = require('express');
const User = require('../models/user.model');
const crypto = require('crypto');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create salt and hash password
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    // Create new user
    const newUser = new User({
        name,
        username,
        email,
        salt,
        passwordHash,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;