const express = require("express");
const { isUserLogin } = require("../middleware/auth.middleware.js");
const tasksControllers = require("../controllers/tasks.controller.js");
const wrapAsync = require("../middleware/wrapAsync.js");
const router = express.Router();


router
  .route("/")
  .post(isUserLogin, wrapAsync(tasksControllers.addNewTask))
  .put(isUserLogin, wrapAsync(tasksControllers.editTask));

router.delete("/:taskId", isUserLogin, wrapAsync(tasksControllers.deleteTask));

router.get(
  "/:skip/:limit",
  isUserLogin,
  wrapAsync(tasksControllers.getAllTasks),
);

module.exports = router;
