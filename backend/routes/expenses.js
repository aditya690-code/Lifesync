import expenses from "express";
import Expense from "../models/expenses.js";
const routes = expenses.Router();

routes.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { _id, title, content, amount, date } = req.body;

    // Here you would typically save the expense to the database
    // For demonstration, we'll just return the received data
    if (date === undefined) {
      date = new Date();
    }

    const expenses = await Expense.find({ userId: userId });
    const existingExpense = expenses.find((expense) => expense._id === _id);
    if (existingExpense) {
      existingExpense.title = title;
      existingExpense.content = content;
      existingExpense.amount = amount;
      existingExpense.date = date;
      await existingExpense.save();
      return res.status(200).send({
        success: true,
        message: "Expense updated successfully",
        expense: existingExpense,
      });
    }

    const newExpense = new Expense({
      userId,
      title,
      content,
      amount,
      date,
    });
    await newExpense.save();

    res.status(201).send({
      success: true,
      message: "Expense added successfully",
      expense: expenses,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in adding expense" });
  }
});

routes.post("/get/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Here you would typically fetch the expenses from the database
    // For demonstration, we'll just return a mock list of expenses
    const expenses = await Expense.find({ userId: userId });

    res.status(200).send({
      success: true,
      message: "Expenses fetched successfully",
      expenses: expenses,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in fetching expenses" });
  }
});

export default routes;
