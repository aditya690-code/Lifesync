const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

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

// Connect to db
connectDB();

module.exports = app;
