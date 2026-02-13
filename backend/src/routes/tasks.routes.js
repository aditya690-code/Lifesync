const express = require("express");
const { isUserLogin } = require("../middleware/auth.middleware.js");
const tasksControllers = require("../controllers/tasks.controller.js");
const router = express.Router();

router.route("/").post(isUserLogin, tasksControllers.addNewTask);

router.get("/:skip/:limit", isUserLogin, tasksControllers.getAllTasks);

module.exports = router;
