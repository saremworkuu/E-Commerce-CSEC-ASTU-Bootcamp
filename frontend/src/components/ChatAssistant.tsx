import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  text: string;
  sender: "user" | "ai";
};

const ChatAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  // 🔥 Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // 🔥 Send message to backend (Express API)
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        // 🔁 replace with your backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
  messages: messages.map(m => ({
    role: m.sender === "user" ? "user" : "assistant",
    content: m.text
  }))
}),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          text: data.reply || "⚠️ No response from AI",
          sender: "ai",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "❌ Server error. Please try again.",
          sender: "ai",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔵 Floating Button */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-black to-gray-800 text-white p-4 rounded-full shadow-2xl"
      >
        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-black opacity-30 animate-ping"></span>
        <MessageCircle size={22} className="relative z-10" />
      </motion.button>

      {/* 🔵 Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed bottom-20 right-6 w-[380px] h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 backdrop-blur-xl bg-white/80 flex flex-col z-50"
          >
            {/* 🔴 Header */}
            <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-black to-gray-900 text-white">
              <div>
                <h2 className="text-sm font-semibold">AI Assistant</h2>
                <p className="text-[11px] text-gray-300">
                  Smart RAG • Connected
                </p>
              </div>
              <button onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* 🟢 Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-10">
                  👋 Ask me anything from our database
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-2 ${
                    msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {/* AI avatar */}
                  {msg.sender === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`px-4 py-2 text-sm max-w-[75%] rounded-2xl shadow-sm ${
                      msg.sender === "user"
                        ? "bg-black text-white rounded-br-none"
                        : "bg-white border text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* User avatar */}
                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                      You
                    </div>
                  )}
                </motion.div>
              ))}

              {/* 🟡 Typing Animation */}
              {loading && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs">
                    AI
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* 🔵 Input */}
            <div className="p-3 border-t bg-white flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask anything..."
                className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />

              <motion.button
                onClick={sendMessage}
                whileTap={{ scale: 0.9 }}
                className="bg-black text-white p-2 rounded-full hover:scale-105 transition"
              >
                <Send size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;