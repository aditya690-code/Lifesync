const express = require("express");
const calendarControllers = require("../controllers/calendar.controller");
const router = express.Router();
const { isUserLogin } = require("../middleware/auth.middleware");
const wrapAsync = require("../middleware/wrapAsync");

router.post(
  "/:date/:month/:year",
  isUserLogin,
  wrapAsync(calendarControllers.getDataByDate),
);

router.post(
  "/history/:year/:month",
  isUserLogin,
  wrapAsync(calendarControllers.getDataByMonth),
);


module.exports = router;
