'use client'

import { useState, useEffect, useRef } from 'react'
import { Send ,Wind } from 'lucide-react'

export function AiChat() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am BreezeBot🤖' }, { role: 'bot', content: "Ask me anything about stock market terms like 'Bull Market📈.', 'Bear Market🐻', or 'Dividends💰'!" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef(null)

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setInput('')

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: data.content }
      ])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-screen bg-[#0C0C0C] text-white">
      <div
        ref={chatContainerRef}
        className="flex-grow p-4 overflow-y-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', maxHeight: 'calc(100vh - 60px)' }}
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
        {isLoading && (
          <div className="flex justify-start mb-2">
            <div className="px-4 py-2 rounded-lg bg-[#1C1C1C] text-gray-300">
            <Wind/>BreezeBot is thinking...
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-[#2C2C2C] bg-[#1C1C1C] p-2 fixed bottom-0 left-0 right-0">
        <div className="flex items-center container mx-auto px-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-grow bg-[#1C1C1C] text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            className={`ml-2 bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

