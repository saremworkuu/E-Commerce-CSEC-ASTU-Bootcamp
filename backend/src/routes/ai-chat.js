
// routes/ai-chat.js
import Groq from "groq-sdk";
import "dotenv/config";
import Product from "../models/product.js";
import About from "../models/About.js";



// Initialize Groq lazily to prevent crash if key is missing
let groq;
const getGroqClient = () => {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      console.warn("WARNING: GROQ_API_KEY is missing. AI Chat will not work.");
      return null;
    }
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
};


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
          "This is a modern e-commerce platform offering premium products with excellent service and fast delivery. and Also we deliver our products worldwide with free shipping on orders over $50. Our mission is to provide a seamless shopping experience with a wide range of high-quality products at competitive prices.",
      };
    }

    const aboutText = aboutDoc.content || "Modern e-commerce store.";

    // ==================== IMPROVED PRODUCT SEARCH ====================
    let relevantProducts = [];

    if (lastUserMessage) {
      // Extract keywords from user message for better matching
      const keywords = lastUserMessage.toLowerCase().split(/\s+/).filter(word => word.length > 2);
      
      // Build search conditions for each keyword
      const searchConditions = keywords.map(keyword => ({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { category: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ]
      }));

      // Search with multiple keyword matching
      if (searchConditions.length > 0) {
        relevantProducts = await Product.find({
          $and: searchConditions
        })
        .limit(5)
        .lean();
      }

      // Fallback: if no products found with all keywords, try any keyword match
      if (relevantProducts.length === 0 && keywords.length > 0) {
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
    }

    // Final fallback: get recent products if nothing found
    if (relevantProducts.length === 0) {
      relevantProducts = await Product.find({}).sort({ createdAt: -1 }).limit(5).lean();
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
please give short and concise answers. avoid long explanations.
Never answer for general questions! if user ask just say that politely and don't explain about what they asked. Always suggest relevant products related to their asked question when it makes sense. Keep answers concise and engaging to avoid boring the user.
Please don't answers for general questions! answer only for product related and about our website.even user asks about general questions say I'm shoping assistant for this site I can help you find products and tell you about what our website do
Be concise, polite, and natural and short answer user may bored. Suggest relevant products when it makes sense.Please answer short answer don't make the text long please!!.
When the user asks "what is the role of this website" or similar, base your answer on the ABOUT THE WEBSITE section. After every response, end with a short invitation to visit our Contact page at /contact for any questions or inquiries. Use the exact route /contact in the reply.`;

    // ==================== GROQ GENERATION ====================
    const client = getGroqClient();
    if (!client) {
      return res.json({ reply: "AI Chat is currently unavailable. Please contact the administrator." });
    }

    const completion = await client.chat.completions.create({
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