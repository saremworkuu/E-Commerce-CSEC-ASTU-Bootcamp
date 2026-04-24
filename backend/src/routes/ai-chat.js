import Groq from "groq-sdk";
import "dotenv/config";
import Product from "../models/product.js";
import About from "../models/about.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🔥 Clean & normalize user message
const cleanText = (text) => {
  return text.toLowerCase().replace(/[^\w\s]/gi, "");
};

// 🔥 Extract keywords (basic NLP)
const extractKeywords = (text) => {
  const words = cleanText(text).split(" ");
  return words.filter((w) => w.length > 2); // remove small words like "do", "is"
};

const aiChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ reply: "Please send a valid message." });
    }

    const lastUserMessage =
      messages.filter((m) => m.role === "user").pop()?.content || "";

    const keywords = extractKeywords(lastUserMessage);

    // ==================== FETCH ABOUT ====================
    let aboutDoc = await About.findOne().lean();
    if (!aboutDoc) {
      aboutDoc = {
        content:
          "This is a modern e-commerce platform offering premium products with excellent service and fast delivery.",
      };
    }

    const aboutText = aboutDoc.content || "Modern e-commerce store.";

    // ==================== SMART PRODUCT SEARCH ====================
    let relevantProducts = [];

    if (keywords.length > 0) {
      const regexArray = keywords.map((word) => ({
        $or: [
          { name: { $regex: word, $options: "i" } },
          { category: { $regex: word, $options: "i" } },
          { description: { $regex: word, $options: "i" } },
        ],
      }));

      relevantProducts = await Product.find({
        $and: regexArray,
      })
        .limit(5)
        .lean();
    }

    // 🔥 fallback: try loose search
    if (relevantProducts.length === 0 && lastUserMessage) {
      relevantProducts = await Product.find({
        $or: [
          { name: { $regex: lastUserMessage, $options: "i" } },
          { category: { $regex: lastUserMessage, $options: "i" } },
        ],
      })
        .limit(5)
        .lean();
    }

    // ==================== 🚫 NO PRODUCT FOUND ====================
    if (relevantProducts.length === 0) {
      return res.json({
        reply:
          "🤖 I currently support questions related to products on this website only.\n\nIf you need help or have feedback, please visit our Contact page — we’ll respond quickly!",
      });
    }

    // ==================== CONTEXT ====================
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
    const systemPrompt = `
You are a helpful AI shopping assistant.

Rules:
- Answer ONLY using the provided products and website info
- Be natural and friendly
- Recommend products clearly
- If multiple products match, suggest best ones
- Keep answers short and helpful
`;

    // ==================== AI CALL ====================
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\nContext:\n${context}`,
        },
        ...messages,
      ],
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      reply:
        "❌ Server error. Please try again later or contact support.",
    });
  }
};

export default aiChat;