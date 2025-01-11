'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const stocks = [
  { name: 'Stock A', value: '₹12,000', trend: 'up' },
  { name: 'Stock B', value: '₹8,500', trend: 'down' },
  { name: 'Stock C', value: '₹15,200', trend: 'up' },
]

export function Portfolio() {
  const router = useRouter()

  return (
    <div className="bg-[#0C0C0C] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Main Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-[#1C1C1C] border-[#2C2C2C]">
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium text-purple-500 mb-2">Your Assets</h2>
              <p className="text-4xl font-bold text-purple-500">₹1,45,000</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1C] border-[#2C2C2C]">
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium text-green-500 mb-2">Target Set</h2>
              <p className="text-4xl font-bold text-green-500">₹30,000</p>
            </CardContent>
          </Card>
        </div>

        {/* Target Volume Card */}
        <Card className="bg-[#1C1C1C] border-[#2C2C2C] mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium text-green-500 mb-2">Target Volume</h2>
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-white">₹30,000</p>
              <p className="text-lg font-semibold text-green-500">75% to Target</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Cards */}
        <div className="grid gap-4 md:grid-cols-1">
          <h2 className="text-lg font-medium text-green-500 mb-4">Your Funded Stock</h2>
          {stocks.map((stock) => (
            <Card
              key={stock.name}
              className="bg-[#1C1C1C] border-[#2C2C2C] cursor-pointer transition-transform hover:scale-[1.02] shadow-lg"
              onClick={() => router.push(`/stock?name=${encodeURIComponent(stock.name)}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{stock.name}</h3>
                  {stock.trend === 'up' ? (
                    <TrendingUpIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDownIcon className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-green-500">{stock.value}</p>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/sell?name=${encodeURIComponent(stock.name)}`)
                    }}
                  >
                    Sell
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

