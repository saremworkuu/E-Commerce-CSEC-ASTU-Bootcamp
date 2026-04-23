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

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "✨ I can help you find products, answer questions, and assist you!",
          sender: "ai",
        },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-black to-gray-800 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition"
      >
        <MessageCircle size={22} />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-[380px] h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 backdrop-blur-xl bg-white/90 flex flex-col">

          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-black to-gray-900 text-white">
            <div>
              <h2 className="text-sm font-semibold">AI Assistant</h2>
              <p className="text-[11px] text-gray-300">Online • Ready to help</p>
            </div>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50 to-white">

            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-10">
                👋 Hi! Ask me anything about products
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
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
                    U
                  </div>
                )}
              </div>
            ))}

            {/* Typing animation */}
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

          {/* Input */}
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
