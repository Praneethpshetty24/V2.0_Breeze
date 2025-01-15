'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { usePriceGenerator } from './PriceGenerator'

const initialData = [
  { date: '2023-01-01', price: 170 },
  { date: '2023-02-01', price: 172 },
  { date: '2023-03-01', price: 175 },
  { date: '2023-04-01', price: 173 },
  { date: '2023-05-01', price: 178 },
  { date: '2023-06-01', price: 180 },
  { date: '2023-07-01', price: 177 },
  { date: '2023-08-01', price: 179 },
  { date: '2023-09-01', price: 178 },
  { date: '2023-10-01', price: 180 },
  { date: '2023-11-01', price: 181 },
  { date: '2023-12-01', price: 178.72 },
]

export default function AnimatedStockChart() {
  const [data, setData] = useState(initialData)
  const currentPrice = usePriceGenerator()

  useEffect(() => {
    const interval = setInterval(() => {
      setData(currentData => {
        const newData = [...currentData]
        newData.shift() // Remove the first element
        const newDate = new Date(new Date(newData[newData.length - 1].date).getTime() + 24 * 60 * 60 * 1000) // Next day
        newData.push({
          date: newDate.toISOString().split('T')[0],
          price: currentPrice
        })
        return newData
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [currentPrice])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#1C1C1C] p-6 rounded-lg h-[300px]"
    >
      <h2 className="text-xl font-semibold mb-4 text-white">Live Price History</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="date" 
            stroke="#666" 
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value}`}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1C1C1C', border: 'none' }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#22C55E' }}
            formatter={(value) => [`₹${value.toFixed(2)}`, 'Price']}
            labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#22C55E" 
            strokeWidth={2}
            dot={false}
          >
            <motion.animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

