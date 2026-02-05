import express from "express";
const routes = express.Router();
import Note from "../models/note.js";

routes.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { _id, title, content } = req.body;

    const notes = await Note.find({ userId: userId });
    const existingNote = notes.find((note) => note._id == _id);
    if (existingNote) {
      existingNote.title = title;
      existingNote.content = content;
      await existingNote.save();
      return res.status(200).send({
        success: true,
        message: "Note updated successfully",
        note: existingNote,
      });
    }

    const newNote = new Note({
      userId,
      title,
      content,
    });
    await newNote.save();

    res.status(201).send({
      success: true,
      message: "Note added successfully",
      note: newNote,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in adding note" });
  }
});

routes.post("/get/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const notes = await Note.find({ userId: userId });
    res.status(200).send({ success: true, notes: notes });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in fetching notes" });
  }
});

export default routes;
