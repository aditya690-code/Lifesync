const Note = require("../models/Note.model.js");

// Get Notes
const getAllNotes = async (req, res) => {
  try {
    const { skip, limit } = req.params;

    const notes = await Note.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: "data fetched",
      notes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log(title, content);
    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and content is required",
      });
    }

    const newNote = await Note.create({
      title: title.trim(),
      content: content.trim(),
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Note created",
      newNote,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Edit Note
const editNote = async (req, res) => {};

// Delete Note
const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete({ _id: req.params.noteId });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

module.exports = {
  getAllNotes,
  createNote,
  editNote,
  deleteNote,
};
