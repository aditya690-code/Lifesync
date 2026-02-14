const express = require("express");
const noteController = require("../controllers/notes.controller");
const { isUserLogin } = require("../middleware/auth.middleware");
const wrapAsync = require("../middleware/wrapAsync");

const router = express.Router();
// Add routes
router.get("/:skip/:limit", isUserLogin, wrapAsync(noteController.getAllNotes));
// routes.post('/', SessionController.store);
// routes.put('/', SessionController.store);
// routes.delete('/', SessionController.store);

module.exports = router;
