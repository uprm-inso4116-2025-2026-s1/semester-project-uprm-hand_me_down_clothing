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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 320, height: 384 }); // w-80 = 320px, h-96 = 384px
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbot-messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Failed to load chat history:', error);
        // If loading fails, start with default message
        setMessages([
          {
            id: 1,
            text: "Hi there! I am Sleevy, your virtual assistant! How can I assist you today?",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }
    } else {
      // No saved messages, start with default welcome message
      setMessages([
        {
          id: 1,
          text: "Hi there! I am Sleevy, your virtual assistant! How can I assist you today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbot-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !chatBoxRef.current) return;

      const rect = chatBoxRef.current.getBoundingClientRect();
      const newWidth = Math.max(280, Math.min(600, rect.right - e.clientX + rect.width));
      const newHeight = Math.max(300, Math.min(700, e.clientY - rect.top));

      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleClearHistory = () => {
    const confirmClear = window.confirm('Are you sure you want to clear the chat history?');
    if (confirmClear) {
      const welcomeMessage: Message = {
        id: Date.now(),
        text: "Hi there! I am Sleevy, your virtual assistant! How can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      localStorage.setItem('chatbot-messages', JSON.stringify([welcomeMessage]));
    }
  };

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
    setIsTyping(true); // Show typing indicator

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

      setIsTyping(false); // Hide typing indicator
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

      setIsTyping(false); // Hide typing indicator
      setMessages((prev) => [...prev, errorMessage]);

    }
  };

  return (
    <div 
      ref={chatBoxRef}
      className="mt-3 bg-white rounded-xl shadow-xl border p-3 flex flex-col relative"
      style={{ 
        width: `${dimensions.width}px`, 
        height: `${dimensions.height}px`,
        userSelect: isResizing ? 'none' : 'auto'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h3 className="font-bold italic text-lg">Chat with us</h3>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleClearHistory}
            aria-label="Clear chat history"
            className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            title="Clear chat history"
          >
            🗑️
          </button>
          <button
            onClick={onClose}
            aria-label="Close chat box"
            className="text-gray-500 hover:text-gray-800 font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto mt-2 mb-2 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-3 py-2 rounded-lg text-sm chat-bubble-enter ${
                message.sender === "user"
                  ? "bg-[#e6dac7] text-[#333333] chat-bubble-user"
                  : "bg-[#F9F8F8] text-[#666666] border border-[#E5E7EF] chat-bubble-bot"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[75%] px-3 py-2 rounded-lg text-sm bg-[#F9F8F8] border border-[#E5E7EF] chat-bubble-enter chat-bubble-bot">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        
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

      {/* Resize Handle */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize group"
        aria-label="Resize chat window"
      >
        <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-gray-400 group-hover:border-gray-600 transition-colors" />
      </div>
    </div>
  );
}
