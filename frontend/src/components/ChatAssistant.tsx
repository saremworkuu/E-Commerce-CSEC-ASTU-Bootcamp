'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔥 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🔥 Welcome message
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            "👋 Hi! I'm your AI shopping assistant. Ask me about products, prices, or this website!",
        },
      ]);
    }
  }, [open]);

  // 🔥 Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // 🔥 Send message (CONNECTED TO YOUR BACKEND)
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: 'assistant',
        content:
          data.reply ||
          "⚠️ I couldn't find anything. Try another product.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '❌ Server error. Please try again or contact support.',
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
        className="fixed bottom-6 right-6 z-50 bg-linear-to-r from-black to-gray-800 text-white p-4 rounded-full shadow-2xl"
      >
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
            transition={{ duration: 0.35 }}
            className="fixed bottom-20 right-6 w-[380px] h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 backdrop-blur-xl bg-white/90 flex flex-col z-50"
          >
            {/* 🔴 Header */}
            <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-black to-gray-900 text-white">
              <div>
                <h2 className="text-sm font-semibold">
                  LuxeCart Shoping Assistant
                </h2>
                <p className="text-[11px] text-gray-300">
                  Get response with in a second
                </p>
              </div>
              <button onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* 🟢 Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`px-4 py-2 text-sm max-w-[75%] rounded-2xl shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-black text-white rounded-br-none'
                        : 'bg-white border text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* 🔄 Typing */}
              {loading && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 🔵 Input */}
            <div className="p-3 border-t bg-white flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
                placeholder="Ask about products..."
                className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />

              <motion.button
                onClick={sendMessage}
                whileTap={{ scale: 0.9 }}
                className="bg-black text-white p-2 rounded-full"
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