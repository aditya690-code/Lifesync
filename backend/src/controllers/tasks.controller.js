const Task = require("../models/task.model.js");

// Get taskk
const getAllTasks = async (req, res) => {
  const { skip = 0, limit = 10 } = req.params;
  const tasks = await Task.find({ userId: req.user.id })
    .skip(Number(skip))
    .limit(Number(limit));

  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Tasks fetched",
    tasks,
  });
};

// Create a task
const addNewTask = async (req, res) => {
  try {
    const { title, content } = req.body;

    await Task.create({ title, content, userId: req.user.id });

    res.status(201).json({
      success: true,
      message: "Task created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Edit Task
const editTask = async (req, res) => {
  const task = req.body.task;

  const editTask = await Task.findByIdAndUpdate(
    { _id: task._id },
    { title: task.title, content: task.content, isDone: task.isDone },
  );

  await res
    .status(200)
    .json({ success: true, message: "Updated successfully" });
};

// Delete Task
const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete({ _id: req.params.taskId });
  res.status(200).json({
    success: true,
    message: "Deleted successfully",
  });
};

module.exports = { getAllTasks, addNewTask, editTask, deleteTask };
