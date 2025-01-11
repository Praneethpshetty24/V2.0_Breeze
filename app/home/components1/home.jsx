'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Home() {
  return (
    <div className="bg-[#0C0C0C] p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <Card className="bg-[#1C1C1C] border-[#2C2C2C] text-white">
          <CardHeader>
            <CardTitle className="text-xl font-medium">HDFC Bank</CardTitle>
            <div className="text-2xl font-bold text-purple-500">7.25% <span className="text-sm text-gray-400">p.a.</span></div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-gray-400">
              <span>Min Amount</span>
              <span>₹25,000</span>
            </div>
            <div className="flex justify-between text-gray-400 mt-2">
              <span>Tenure</span>
              <span>2-3 years</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1C1C1C] border-[#2C2C2C] text-white">
          <CardHeader>
            <CardTitle className="text-xl font-medium">ICICI Bank</CardTitle>
            <div className="text-2xl font-bold text-purple-500">7.10% <span className="text-sm text-gray-400">p.a.</span></div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-gray-400">
              <span>Min Amount</span>
              <span>₹10,000</span>
            </div>
            <div className="flex justify-between text-gray-400 mt-2">
              <span>Tenure</span>
              <span>1-2 years</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1C1C1C] border-[#2C2C2C] text-white">
          <CardHeader>
            <CardTitle className="text-xl font-medium">SBI</CardTitle>
            <div className="text-2xl font-bold text-purple-500">6.90% <span className="text-sm text-gray-400">p.a.</span></div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-gray-400">
              <span>Min Amount</span>
              <span>₹5,000</span>
            </div>
            <div className="flex justify-between text-gray-400 mt-2">
              <span>Tenure</span>
              <span>3-5 years</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

