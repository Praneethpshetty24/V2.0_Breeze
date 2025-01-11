'use client'

import { motion } from 'framer-motion'
import { Heart, Bookmark } from 'lucide-react'

export default function StockHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-[#1C1C1C] rounded-lg"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white">AAPL</h1>
          <p className="text-gray-400">Apple Inc.</p>
          <div className="flex items-center mt-2">
            <span className="text-3xl font-semibold text-white">$178.72</span>
            <span className="ml-2 text-green-500">+2.35%</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="text-gray-400 hover:text-[#9333EA] transition-colors">
            <Heart className="w-6 h-6" />
          </button>
          <button className="text-gray-400 hover:text-[#9333EA] transition-colors">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

