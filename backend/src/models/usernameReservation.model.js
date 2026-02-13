const mongoose = require("mongoose");

const usernameReservationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900, // 15 min
  },
});

module.exports = mongoose.model(
  "UsernameReservation",
  usernameReservationSchema,
);
