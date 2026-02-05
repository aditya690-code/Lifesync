import express from "express";
const routes = express.Router();
import Expense from "../models/expenses.js";
import Journal from "../models/journal.js";
import Note from "../models/note.js";
import Task from "../models/task.js";

routes.route("/:userId").post(async (req, res) => {
  const { userId } = req.params;

  const expenses = await Expense.find({ userId: userId });
  const diaries = await Journal.find({ userId: userId });
  const notes = await Note.find({ userId: userId });
  const tasks = await Task.find({ userId: userId });

  // Filter out undefined entries if any
  const date = new Date();

  expenses = expenses.filter((expense, index, self) => {
    const ExpenseDate = new Date(expense.createdAt);
    return (
      ExpenseDate.getMonth() === date.getMonth() &&
      ExpenseDate.getFullYear() === date.getFullYear()
    );
  });
  tasks = tasks.filter((task, index, self) => {
    const TaskDate = new Date(task.createdAt);
    return (
      TaskDate.getMonth() === date.getMonth() &&
      TaskDate.getFullYear() === date.getFullYear()
    );
  });

  diaries = diaries.slice(-5);
  notes = notes.slice(-5);

  res.status(200).send({ data: { expenses, diaries, notes, tasks } });
});

export default routes;
