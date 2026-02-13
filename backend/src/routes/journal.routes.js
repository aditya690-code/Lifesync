const express = require("express");
const router = express.Router();
const Journal = require("../models/journal.model");
const { isUserLogin } = require("../middleware/auth.middleware");
const journalController = require("../controllers/journal.controller");

// Create new Journal
router
  .route("/")

  .post(isUserLogin, journalController.newJouranl);

router.get("/:skip/:limit", isUserLogin, journalController.getData);

module.exports = router;
