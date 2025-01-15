'use client'

import { motion } from 'framer-motion'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const profitLossData = [
  { month: 'Jan', value: 12000 },
  { month: 'Feb', value: 15000 },
  { month: 'Mar', value: 18000 },
  { month: 'Apr', value: 14000 },
  { month: 'May', value: 16000 },
  { month: 'Jun', value: 15000 },
]

export default function ProfitLoss() {
  const currentProfitLoss = profitLossData.reduce((sum, item) => sum + item.value, 0)
  const isProfit = currentProfitLoss >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1C1C1C] p-6 rounded-lg"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Profit/Loss This Year</h2>
        <div className={`flex items-center ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
          {isProfit ? (
            <ArrowUpIcon className="w-6 h-6 mr-2" />
          ) : (
            <ArrowDownIcon className="w-6 h-6 mr-2" />
          )}
          <span className="text-3xl font-bold">
          ₹{Math.abs(currentProfitLoss).toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={profitLossData}>
            <XAxis 
              dataKey="month" 
              stroke="#666" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value/1000}k`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1C1C1C', border: 'none' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#22C55E' }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
            />
            <Bar 
              dataKey="value" 
              fill="#22C55E"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

