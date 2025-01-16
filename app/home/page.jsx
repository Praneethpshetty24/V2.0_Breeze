'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wind, HomeIcon, Trophy, LayoutGrid, Users2, UserCircle, MessageCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Home from './components1/home'
import { Portfolio } from './components1/portfolio'
import Achievements  from './components1/achievements'
import { Profile } from './components1/profile'
import { Chat } from './components1/chat'
import { AiChat } from '@/app/home/components1/aichat'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'portfolio', label: 'Portfolio', icon: LayoutGrid },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'aiChat', label: 'AI Chat', icon: MessageCircle }, 
  ]

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';  
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0C0C]">
      {/* Navigation */}
      <nav className="border-b border-[#2C2C2C] bg-[#1C1C1C]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-transparent bg-clip-text">
              Breeze
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-purple-500 border-2 border-violet-500 px-4 py-2 ">
                  <Users2 className="h-5 w-5 " />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="p-0 bg-[#0C0C0C] text-white border-[#2C2C2C] w-[95%] sm:w-[450px] md:w-[550px] lg:w-[600px] flex flex-col h-full"
              >
                <div className="flex flex-col h-full">
                  <Chat />
                </div>
              </SheetContent>
            </Sheet>
            
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-white hover:text-purple-500 border-2 border-violet-500 px-4 py-2 "
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-[#1C1C1C] rounded-3xl mt-4 mx-4 overflow-hidden sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-3 relative ${
                    activeTab === tab.id ? 'text-purple-500' : 'text-gray-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 mt-6 flex-grow">
        {activeTab === 'home' && <Home />}
        {activeTab === 'portfolio' && <Portfolio />}
        {activeTab === 'achievements' && <Achievements />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'aiChat' && <AiChat />} {/* New Content */}
      </main>
    </div>
  )
}
