const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isDone: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    createdAt: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
