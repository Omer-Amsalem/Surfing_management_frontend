import React, { useState, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { FiSend } from 'react-icons/fi';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const user = JSON.parse(localStorage.getItem('user') || '{}');

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: userInput,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post(
        'http://localhost:3000/api.gemini.com/message',
        { message: userInput }, { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );

      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.data.message,
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setUserInput('');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-purple-600 text-white p-4 text-lg font-semibold shadow text-center">
        Chat Assistant
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Avatar */}
            {message.role === 'assistant' && (
              <img
                src="https://via.placeholder.com/40"
                alt="Assistant Avatar"
                className="h-10 w-10 rounded-full mr-2"
              />
            )}
            <div>
              {/* Chat Bubble */}
              <div
                className={`max-w-xs p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-purple-500 text-white rounded-tr-none'
                    : 'bg-gray-200 text-gray-900 rounded-tl-none'
                }`}
              >
                {message.content}
              </div>
              {/* Timestamp */}
              <p className="text-xs text-gray-500 mt-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {message.role === 'user' && (
              <img
                src= {user.userPhoto}
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
        className="flex items-center bg-white p-4 border-t border-gray-300"
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-grow border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Type your message here..."
        />
        <button
          type="submit"
          className="ml-4 bg-purple-500 text-white p-3 rounded-full shadow hover:bg-purple-600 transition"
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
