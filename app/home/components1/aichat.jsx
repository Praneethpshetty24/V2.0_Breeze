'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'

export function AiChat() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! How can I assist you today?' }
  ])
  const [input, setInput] = useState('')
  const chatContainerRef = useRef(null)

  const sendMessage = () => {
    if (!input.trim()) return

    // Add user message to the chat
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)

    // Simulate AI response (you can replace this with API call logic)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: `I'm here to help with "${input}".` }
      ])
    }, 1000)

    // Clear input
    setInput('')
  }

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-screen bg-[#0C0C0C] text-white">
      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-grow p-4 overflow-y-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar for Firefox & IE
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } mb-2`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                message.role === 'user'
                  ? 'bg-purple-500 text-white'
                  : 'bg-[#1C1C1C] text-gray-300'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Input Box */}
      <div className="border-t border-[#2C2C2C] bg-[#1C1C1C] p-2">
        <div className="flex items-center container mx-auto px-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-grow bg-[#1C1C1C] text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
