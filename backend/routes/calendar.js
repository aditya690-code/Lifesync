import express from "express";
const router = express.Router();
import Expense from "../models/expenses.js";
import Journal from "../models/journal.js";
import Note from "../models/note.js";
import Task from "../models/task.js";

router.post("/:userId/:date/:month/:year", async (req, res) => {
  try {
    const { userId, date, month, year } = req.params;
    const fullDate = `${date}-${month}-${year}`;
    const dateObj = new Date(year, month - 1, date); // month is 0-indexed in JavaScript

    const expenses = await Expense.find({ userId: userId, createdAt: dateObj });
    const journals = await Journal.find({ userId: userId, createdAt: dateObj });
    const notes = await Note.find({ userId: userId, createdAt: dateObj });
    const tasks = await Task.find({ userId: userId, createdAt: dateObj });

    res.status(200).send({
      success: true,
      message: "Calendar data fetched successfully",
      data: {
        expenses,
        journals,
        notes,
        tasks,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in fetching calendar data" });
  }
});

export default router;
