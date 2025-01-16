'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Wind, X, Reply, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SheetTitle, SheetClose } from '@/components/ui/sheet'
import { db, auth } from '@/firebase'
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'

export function Chat() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [user] = useAuthState(auth)
  const [replyTo, setReplyTo] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('timestamp', 'asc'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMessages(messagesData)
    })

    return () => unsubscribe()
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    try {
      const messageData = {
        sender: user.displayName || 'Anonymous',
        userId: user.uid,
        message: newMessage,
        timestamp: new Date().toISOString(),
        displayTime: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }

      // Add reply data if replying to a message
      if (replyTo) {
        messageData.replyTo = {
          id: replyTo.id,
          message: replyTo.message,
          sender: replyTo.sender
        }
      }

      await addDoc(collection(db, 'chats'), messageData)
      
      setNewMessage('')
      setReplyTo(null)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleReply = (msg) => {
    setReplyTo(msg)
  }

  const cancelReply = () => {
    setReplyTo(null)
  }

  const ReplyBadge = ({ replyData }) => (
    <div className="bg-[#2C2C2C] rounded-lg p-2 mb-2 text-sm">
      <div className="text-gray-400 text-xs">
        Reply to {replyData.sender}
      </div>
      <div className="text-gray-300 truncate">
        {replyData.message}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <SheetTitle className="sr-only">Chat Dialog</SheetTitle>
      
      <div className="p-4 border-b border-[#2C2C2C]">
        <h2 className="text-xl font-semibold">Breeze Chat</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="space-y-4 pb-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${
                msg.userId === user?.uid ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar className="h-8 w-8 border-2 border-purple-500/20 flex-shrink-0">
                <AvatarFallback className="bg-purple-500/10 text-purple-500">
                  {msg.sender[0]}
                </AvatarFallback>
              </Avatar>
              <div className={`flex flex-col ${
                msg.userId === user?.uid ? 'items-end' : ''
              } max-w-[75%]`}>
                <div className="flex items-center gap-2 mb-1 text-xs">
                  <span className="font-medium text-purple-500">
                    {msg.sender}
                  </span>
                  <span className="text-gray-500">
                    {msg.displayTime}
                  </span>
                </div>
                <div className={`rounded-2xl px-4 py-2 ${
                  msg.userId === user?.uid
                    ? 'bg-purple-500 text-white rounded-tr-none'
                    : 'bg-[#1C1C1C] text-gray-100 rounded-tl-none'
                }`}>
                  {msg.replyTo && <ReplyBadge replyData={msg.replyTo} />}
                  {msg.message}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-purple-500 mt-1"
                  onClick={() => handleReply(msg)}
                >
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0C0C0C] border-t border-[#2C2C2C]">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-[#1C1C1C] rounded-lg px-4 py-2 text-white"
          />
          <button className="p-2 bg-purple-500 rounded-lg">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

