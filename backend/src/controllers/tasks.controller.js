// Require important models
const Task = require("../models/task.model.js");
const User = require("../models/user.model.js");

const getNewToken = require("../utils/generateJwtToken.js");

const addNewTask = async (req, res) => {
  try {
    const { title, content } = req.body;

    await Task.create({ title, content, userId: req.user.id });
    const token = getNewToken(req.user);
    res.cookie("token", token);
    res.status(201).json({
      success: true,
      message: "Task created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllTasks = async (req, res) => {
  const { skip = 0, limit = 10 } = req.params;
  const tasks = await Task.find({ userId: req.user.id })
    .skip(Number(skip))
    .limit(Number(limit));
  const token = getNewToken(req.user);
  res.cookie("token", token, { httpOnly: true });

  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Tasks fetched",
    tasks,
  });
};

module.exports = { addNewTask, getAllTasks };
