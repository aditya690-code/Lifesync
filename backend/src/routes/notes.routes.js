const express = require("express");
const noteController = require("../controllers/notes.controller");
const { isUserLogin } = require("../middleware/auth.middleware");
const wrapAsync = require("../middleware/wrapAsync");

const router = express.Router();
// Add routes
router
  .route("/")
  .post(isUserLogin, wrapAsync(noteController.createNote))
  .put(isUserLogin, wrapAsync(noteController.editNote));

router.delete("/:noteId", isUserLogin, wrapAsync(noteController.deleteNote));

router.get("/:skip/:limit", isUserLogin, wrapAsync(noteController.getAllNotes));

// routes.delete('/', SessionController.store);

module.exports = router;
