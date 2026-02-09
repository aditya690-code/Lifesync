const express = require("express");
const router = express.Router();
// Remove the node-fetch import

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ error: "Message is required and must be a string" });
    }

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3:mini",
        prompt: message,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    res.json({
      response: data.response || "No response from Ollama API",
      success: data.done || false,
    });
  } catch (error) {
    console.error("Error calling Ollama API:", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error.message,
    });
  }
});

module.exports = router;
