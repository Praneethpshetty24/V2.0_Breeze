"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { usePriceGenerator } from "./PriceGenerator"

const timeframes = {
  "1W": 7,
  "1M": 30,
  "1Y": 365,
}

export default function AnimatedStockChart() {
  const [data, setData] = useState(initialData)
  const [timeframe, setTimeframe] = useState("1Y")
  const currentPrice = usePriceGenerator(178.72, 150, 200) // Use price generator

  // Generate new price data only for the latest point for "1W" timeframe
  useEffect(() => {
    if (timeframe === "1W") {
      const interval = setInterval(() => {
        setData((prev) => {
          const historicalData = prev.slice(0, -1) // Keep historical data static
          return [
            ...historicalData,
            {
              date: new Date().toISOString().split("T")[0],
              price: Number(currentPrice.toFixed(2)), // Use generated price
            },
          ]
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [timeframe, currentPrice]) // Depend on timeframe and currentPrice

  // Filter data based on timeframe
  const filteredData = data.slice(-timeframes[timeframe])

  return (
    <div className="w-full max-w-4xl p-4 bg-[#1C1C1C] rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Stock Price</h2>
          <motion.div
            key={currentPrice}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold text-white"
          >
           
          </motion.div>
        </div>
        <div className="flex gap-2">
          {Object.keys(timeframes).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              onClick={() => setTimeframe(tf)}
              size="sm"
              className="text-white"
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full">
        {" "}
        {/* Reduced height */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <XAxis
              dataKey="date"
              stroke="white"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
              fontSize={10}
            />
            <YAxis
              domain={["auto", "auto"]}
              stroke="white"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "white" }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10b981" // Emerald-500 green color
              strokeWidth={2}
              dot={false}
              animateNewValues
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const initialData = [
  { date: "2023-01-01", price: 170 },
  { date: "2023-02-01", price: 172 },
  { date: "2023-03-01", price: 175 },
  { date: "2023-04-01", price: 173 },
  { date: "2023-05-01", price: 178 },
  { date: "2023-06-01", price: 180 },
  { date: "2023-07-01", price: 177 },
  { date: "2023-08-01", price: 179 },
  { date: "2023-09-01", price: 178 },
  { date: "2023-10-01", price: 180 },
  { date: "2023-11-01", price: 181 },
  { date: "2023-12-01", price: 178.72 },
]

