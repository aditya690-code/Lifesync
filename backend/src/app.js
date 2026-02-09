const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const cookieParser = require("cookie-parser");
const multer = require("multer");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  }),
);
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() }); //({ dest: "uploads/" });
app.use(cookieParser());

app.use("/expenses", require("./routes/expenses.routes"));
app.use("/auth", require("./routes/auth.routes.js"));
app.use("/chatbot", require("./routes/chatbot.routes.js"));

module.exports = app;



app.post("/upload", upload.single("file"), (req, res) => {
    const data = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Process the file and data as needed
    console.log("Received file:", file.originalname);
    console.log("Received data:", data);

    res.json({ success: true, message: "File uploaded successfully" });
});