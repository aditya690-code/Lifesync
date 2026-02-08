const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const cookieParser = require("cookie-parser");

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
app.use(cookieParser());

app.use("/expenses", require("./routes/expenses.routes"));
app.use("/auth", require("./routes/auth.routes.js"));

module.exports = app;
