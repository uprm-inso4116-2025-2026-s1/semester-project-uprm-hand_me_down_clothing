"use client";
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/app/types/chat";

interface ChatBoxProps {
  onClose: () => void;
}

// Array of greeting phrases for bot to randomly choose from
const greetingPhrases = [
  "Hi there! I am Sleevy!",
  "Hello! I am Sleevy, here to help you with anything you need.",
  "Greetings! Sleevy at your service. What can I do for you today?",
  "Hey! I'm Sleevy! How may I assist you?",
  "Welcome! I'm Sleevy!"
];

// Helper function to get a random greeting
const getRandomGreeting = () => {
  return greetingPhrases[Math.floor(Math.random() * greetingPhrases.length)]  + " I am able to assist you with various tasks. Feel free to ask me about store locations, open and closed hours, and listings about items in Hands Me Down Clothing.";
};

const acknowledgmentPhrases = [
  "Got it!",
  "One moment please.",
  "I'll take care of that.",
  "Right away!",
  "Understood!"
];

// Helper function to get a random acknowledgment
const getRandomAcknowledgment = () => {
  return acknowledgmentPhrases[Math.floor(Math.random() * acknowledgmentPhrases.length)];
};

export default function ChatBox({ onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
        // Convert timestamp strings back to Date objects and create ChatMessage instances
        const messagesWithDates = parsed.map((msg: any) => 
          ChatMessage.fromObject({
            id: msg.id,
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp
          })
        );
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Failed to load chat history:', error);
        // If loading fails, start with random greeting
        setMessages([
          new ChatMessage(1, getRandomGreeting(), "bot", new Date())
        ]);
      }
    } else {
      // No saved messages, start with random welcome message
      setMessages([
        new ChatMessage(1, getRandomGreeting(), "bot", new Date())
      ]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbot-messages', JSON.stringify(messages.map(msg => msg.toJSON())));
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
      const welcomeMessage = new ChatMessage(
        Date.now(),
        getRandomGreeting(),
        "bot",
        new Date()
      );
      setMessages([welcomeMessage]);
      localStorage.setItem('chatbot-messages', JSON.stringify([welcomeMessage.toJSON()]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {  //user->backend->host->openrouter->bot reply
    e.preventDefault();
    const trimmedMessage = inputValue.trim();
    
    if (!trimmedMessage) return;

    // Add user message
    const userMessage = new ChatMessage(
      Date.now(),
      trimmedMessage,
      "user",
      new Date()
    );

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Show random acknowledgment message
    const acknowledgment = getRandomAcknowledgment();
    const acknowledgmentMessage = new ChatMessage(
      Date.now() + 1,
      acknowledgment,
      "bot",
      new Date()
    );
    
    setMessages((prev) => [...prev, acknowledgmentMessage]);
    
    // Wait 2 seconds before showing typing indicator and fetching response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsTyping(true); // Show typing indicator

    //sending user message to backend api requester 
    try{ 
      const res= await fetch("chatbot-api/api/openrouter_logic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      const data= await res.json();

      //bot response to messages
      const botmessage = new ChatMessage(
        Date.now() + 2,
        data.response || "Unexpected server reply",
        "bot",
        new Date()
      );

      setIsTyping(false); // Hide typing indicator
      setMessages((prev) => [...prev, botmessage]);

    }

    catch(error){
      console.error("Error:", error);

      //fallback error message
      const errorMessage = new ChatMessage(
        Date.now() + 3,
        "Error contacting server",
        "bot",
        new Date()
      );

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
            key={message.getId()}
            className={`flex ${message.isUserSender ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-3 py-2 rounded-lg text-sm chat-bubble-enter ${
                message.isUserSender
                  ? "bg-[#e6dac7] text-[#333333] chat-bubble-user"
                  : "bg-[#F9F8F8] text-[#666666] border border-[#E5E7EF] chat-bubble-bot"
              }`}
            >
              {message.getText()}
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
