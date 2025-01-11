'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Target, TrendingUp } from 'lucide-react'

export function Achievements() {
  return (
    <div className="bg-[#0C0C0C] p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <Card className="bg-[#1C1C1C] border-[#2C2C2C] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              Investment Master
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Achieved 10% returns in first month</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1C1C1C] border-[#2C2C2C] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Goal Achiever
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Reached savings target for Q1</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1C1C1C] border-[#2C2C2C] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Smart Investor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Diversified portfolio across 5 sectors</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

