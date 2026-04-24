// routes/ai-chat.js
import Groq from "groq-sdk";
import "dotenv/config";
import Product from "../models/product.js";
import About from "../models/about.js";

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ====================== MAIN AI CHAT ROUTE ======================
const aiChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ reply: "Please send a valid message." });
    }

    const lastUserMessage =
      messages.filter((m) => m.role === "user").pop()?.content || "";

    // ==================== FETCH ABOUT ====================
    let aboutDoc = await About.findOne().lean();
    if (!aboutDoc) {
      aboutDoc = {
        content:
          "This is a modern e-commerce platform offering premium products with excellent service and fast delivery.",
      };
    }

    const aboutText = aboutDoc.content || "Modern e-commerce store.";

    // ==================== SIMPLE PRODUCT SEARCH ====================
    let relevantProducts = [];

    if (lastUserMessage) {
      // simple keyword search (case-insensitive)
      relevantProducts = await Product.find({
        $or: [
          { name: { $regex: lastUserMessage, $options: "i" } },
          { category: { $regex: lastUserMessage, $options: "i" } },
          { description: { $regex: lastUserMessage, $options: "i" } },
        ],
      })
        .limit(5)
        .lean();
    }

    // fallback if nothing found
    if (relevantProducts.length === 0) {
      relevantProducts = await Product.find({}).limit(5).lean();
    }

    // ==================== BUILD CONTEXT ====================
    const context = `
ABOUT THE WEBSITE:
${aboutText}

RELEVANT PRODUCTS:
${relevantProducts
  .map(
    (p) =>
      `- ${p.name} ($${p.price}) - Category: ${
        p.category || "General"
      } - ${p.description || p.shortDescription || ""}`
  )
  .join("\n")}
    `.trim();

    // ==================== SYSTEM PROMPT ====================
    const systemPrompt = `You are a friendly, helpful, and enthusiastic AI shopping assistant.
Use ONLY the provided context to answer accurately.
Be concise, polite, and natural. Suggest relevant products when it makes sense.
When the user asks "what is the role of this website" or similar, base your answer on the ABOUT THE WEBSITE section.`;

    // ==================== GROQ GENERATION ====================
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\nContext:\n${context}`,
        },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      reply:
        "Sorry, I am having trouble responding right now. Please try again in a moment!",
    });
  }
};

export default aiChat;