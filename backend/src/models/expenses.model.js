const mongoose = require('mongoose');

const expesseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, required: true },
}, { timestamps: true });