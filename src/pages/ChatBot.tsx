import React, { useState, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { FiSend } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import Header from "../components/Header";
import { getAccessToken, isRTL } from "../utils/generalFunctions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const user = JSON.parse(localStorage.getItem("user") || "{}");

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: userInput,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const accessToken = await getAccessToken(user);

    if (!accessToken) {
      localStorage.removeItem("user");
      localStorage.removeItem("expiresAt");
      toast.error("Please log in to continue.");
      navigate('/login');
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api.gemini.com/message`,
        { message: userInput },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: response.data.message,
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setUserInput("");
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-screen relative">
      <div className="sticky top-0 z-20 shadow-md">
        {/* Header */}
        <Header pageTitle="Kelly A.I" />
      </div>

      {/* Chat Messages */}
      <div
        style={{ backgroundImage: `url('/images/surfClub_logo_noBCG.png')` }}
        className="flex-grow overflow-y-auto p-4 space-y-4 bg-opacity-75 bg-no-repeat bg-center relative z-90"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            {/* Avatar */}
            {message.role === "assistant" && (
              <img
                src="/images/botFace.png"
                alt="Assistant Avatar"
                className="h-10 w-10 rounded-full mr-2"
              />
            )}
            <div>
              {/* Chat Bubble */}
              <div
                className={`max-w-xs p-3 rounded-2xl ${message.role === "user"
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-200 text-gray-900 rounded-tl-none"
                  } whitespace-pre-wrap`}
                dir={isRTL(message.content) ? "rtl" : "ltr"} // Dynamically set direction
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
              {/* Timestamp */}
              <p className="text-xs text-gray-500 mt-1">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {message.role === "user" && (
              <img
                src={`${import.meta.env.VITE_API_URL}/${user.userPhoto}`}
                alt="User Avatar"
                className="h-10 w-10 rounded-full ml-2"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white p-4 border-t border-gray-300 z-100"
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-grow border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 z-100"
          placeholder="Type your message here..."
        />
        <button
          type="submit"
          className="ml-4 bg-blue-500 text-white p-3 rounded-full shadow hover:bg-blue-600 transition z-100"
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
