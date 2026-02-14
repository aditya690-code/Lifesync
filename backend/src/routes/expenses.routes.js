const express = require("express");
const Expenses = require("../models/expenses.model");
const router = express.Router();
const wrapAsync = require("../middleware/wrapAsync.js");
const { createExpense } = require("../controllers/expenses.controller.js");

router.post("/", wrapAsync(createExpense));

router.get("/", async (req, res) => {
  const userId = "698888d97e250684d5470cab";
  const expenses = await Expenses.find({ userId });

  res.json(expenses);
});

module.exports = router;
