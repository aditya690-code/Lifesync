import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.js";
import calendarRoute from "./routes/calendar.js";
import chatRoute from "./routes/chatbot.js";
import expensesRoutes from "./routes/expenses.js";
import homeRoute from "./routes/home.js";
import journalRoute from "./routes/journal.js";
import noteRoute from "./routes/note.js";
import taskRoute from "./routes/task.js";

const app = express();
connectDB();

dotenv.config();
// app.use(cors());
app.use(cors({
  origin: "http://localhost:8000",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/auth", authRoutes);
// app.use("/calendar", calendarRoute);
// app.use("/chat", chatRoute);
// app.use("/expenses", expensesRoutes);
// app.use("/home", homeRoute);
// app.use("/journal", journalRoute);
// app.use("/notes", noteRoute);
// app.use("/tasks", taskRoute);

app.get("/", (req, res) => {
  res.send("Hi, welcome to lifesync");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
