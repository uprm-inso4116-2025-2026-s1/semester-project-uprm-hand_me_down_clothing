"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatBoxProps {
  onClose: () => void;
}

export default function ChatBox({ onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Testing text bubbles.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {  //user->backend->host->openrouter->bot reply
    e.preventDefault();
    const trimmedMessage = inputValue.trim();
    
    if (!trimmedMessage) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: trimmedMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    //sending user message to backend api requester 
    try{ 
      const res= await fetch("/api/openrouter_logic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      const data= await res.json();

      //bot response to messages
      const botmessage: Message= {
        id: Date.now()+1,
        text: data.response || "Unexpected server reply",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botmessage]);

    }

    catch(error){
      console.error("Error:", error);

      //fallback error message
      const errorMessage: Message= {

        id: Date.now()+2,
        text: "Error contacting server",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);

    }
  };

  return (
    <div className="mt-3 w-80 h-96 bg-white rounded-xl shadow-xl border p-3 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h3 className="font-bold italic text-lg">Chat with us</h3>
        <button
          onClick={onClose}
          aria-label="Close chat box"
          className="text-gray-500 hover:text-gray-800 font-bold"
        >
          ✕
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto mt-2 mb-2 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                message.sender === "user"
                  ? "bg-[#e6dac7] text-[#333333]"
                  : "bg-[#F9F8F8] text-[#666666] border border-[#E5E7EF]"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="message"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 border border-[#E5E7EF] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B1B1] text-[#666666]"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-[#e6dac7] hover:bg-[#d8c8b4] px-4 py-2 rounded-lg text-sm font-bold italic"
        >
          Send
        </button>
      </form>
    </div>
  );
}
