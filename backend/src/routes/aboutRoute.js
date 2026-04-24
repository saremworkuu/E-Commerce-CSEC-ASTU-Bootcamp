// routes/aboutRoutes.js
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import About from '../models/About.js';

dotenv.config();

const router = express.Router();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const embeddingModel = genAI.getGenerativeModel({ 
  model: 'gemini-embedding-001'   // Best stable embedding model (3072 dim)
});

// Helper: Generate embedding
async function getEmbedding(text) {
  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;   // array of numbers
  } catch (error) {
    console.error("Embedding error:", error);
    throw new Error("Failed to generate embedding");
  }
}

// ================= CREATE / UPDATE ABOUT (Admin only) =================
export const createOrUpdateAbout = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!content || content.trim().length < 10) {
      return res.status(400).json({ message: "Content must be at least 10 characters" });
    }

    // Generate fresh embedding
    const embedding = await getEmbedding(content);

    // Update existing or create new (singleton)
    let about = await About.findOne();

    if (about) {
      about.title = title || about.title;
      about.content = content;
      about.embedding = embedding;
      await about.save();
      return res.json({ message: "About updated successfully", about });
    } else {
      about = await About.create({
        title: title || "About Our Website",
        content,
        embedding
      });
      return res.json({ message: "About created successfully", about });
    }
  } catch (error) {
    console.error("Create/Update About Error:", error);
    res.status(500).json({ message: "Server error while saving About" });
  }
};

// ================= GET ABOUT =================
export const getAbout = async (req, res) => {
  try {
    const about = await About.getAbout();   // uses the static method
    res.json(about);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching About" });
  }
};

// Routes
router.post('/', createOrUpdateAbout);     // Admin: POST /api/about
router.get('/', getAbout);                 // Public: GET /api/about

export default router;