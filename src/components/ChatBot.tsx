"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, X, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Rublix, your personal AI assistant. Ask me anything about Rudra's projects, skills, or experience!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showTryMe, setShowTryMe] = useState(true);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hide the prompt after a short delay so it does not stay forever.
  useEffect(() => {
    const timer = setTimeout(() => setShowTryMe(false), 9000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          messages: messages,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const fallbackMessage = "Sorry, I encountered an error. Please try again.";
        const quotaMessage =
          "I am currently rate-limited due to API quota. Please try again shortly.";
        const resolvedMessage =
          response.status === 429
            ? data?.message ?? quotaMessage
            : data?.message ?? fallbackMessage;

        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: resolvedMessage,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && showTryMe && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: [0, -4, 0], scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
            y: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="fixed bottom-24 right-6 z-40 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg"
        >
          Try me
        </motion.div>
      )}

      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTryMe(false);
        }}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white shadow-lg hover:shadow-2xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chat Window */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={isOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-24 right-6 z-40 w-96 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-96 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
          <h3 className="font-bold">Rublix | Personal AI Assistant</h3>
          <p className="text-xs text-indigo-100">Ask about my projects & experience</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-lg p-3 text-sm ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-100 border border-gray-700"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-100 rounded-lg p-3 flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.1s" }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="border-t border-gray-800 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
              disabled={isLoading}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 rounded-lg p-2 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}
