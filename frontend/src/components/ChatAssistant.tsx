import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const ChatAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "ai" }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // simulate AI response
    setTimeout(() => {
      const aiMessage = {
        text: "I can help you find products or answer questions!",
        sender: "ai" as const,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-xl hover:scale-105 transition"
      >
        <MessageCircle size={22} />
      </button>

      {/* Chat Container */}
      {open && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border">
          
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 bg-black text-white">
            <div>
              <h2 className="text-sm font-semibold">AI Assistant</h2>
              <p className="text-xs text-gray-300">Online • Ready to help</p>
            </div>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 text-sm">
                Ask me anything about products 👋
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${
                    msg.sender === "user"
                      ? "bg-black text-white rounded-br-none"
                      : "bg-white border text-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-400">
                AI is typing...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products..."
              className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-black text-white p-2 rounded-full hover:scale-105 transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
