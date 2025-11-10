// Load dotenv from chatbot.env
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from chatbot.env
config({ path: resolve(__dirname, "openrouter.env") });

// Imports
import express from "express";
import axios from "axios";
import cors from "cors";
import type { Request, Response } from "express";

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Server port
const PORT = 5000;

// Chat endpoint
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    console.log("Sending request to OpenRouter:", {
      url: process.env.OPENROUTER_BASE_URL,
      model: "google/gemini-2.0-flash-exp:free",
      messages: [{ role: "user", content: message }],
    });

    const response = await axios.post(
      process.env.OPENROUTER_BASE_URL!,
      {
        model: "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error("Axios Error Response:", error.response?.data);
    console.error("Axios Error Message:", error.message);
    if (error.response) console.error(error.response.status, error.response.statusText);
    res.status(500).json({ error: "Failed to fetch from OpenRouter" });
  }
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
