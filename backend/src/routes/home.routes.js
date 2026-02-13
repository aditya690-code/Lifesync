const express = require("express");
const router = express.Router();
const { isUserLogin } = require("../middleware/auth.middleware");
const homeControllers = require("../controllers/home.controller");

router.get("/", isUserLogin, homeControllers.getHomeData);

module.exports = router;
