const express = require("express");
const calendarControllers = require("../controllers/calendar.controller");
const router = express.Router();
const { isUserLogin } = require("../middleware/auth.middleware");

router.post(
  "/:date/:month/:year",
  isUserLogin,
  calendarControllers.getDataByDate,
);

module.exports = router;
