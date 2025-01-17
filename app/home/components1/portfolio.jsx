'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db, auth } from '@/firebase'

export function Portfolio() {
  const router = useRouter()
  const [purchasedStocks, setPurchasedStocks] = useState([])
  const [totalAssets, setTotalAssets] = useState(0)
  const targetAmount = 30000 // Fixed target amount
  
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const userId = auth.currentUser?.uid
        if (!userId) return

        const purchasesRef = collection(db, 'purchases')
        const userPurchasesQuery = query(purchasesRef, where('userId', '==', userId))
        const snapshot = await getDocs(userPurchasesQuery)
        const stocks = snapshot.docs.map(doc => ({
          name: doc.data().stockName,
          value: doc.data().totalAmount,
          quantity: doc.data().quantity,
          trend: 'up',
        }))
        setPurchasedStocks(stocks)
        // Calculate total assets
        const total = stocks.reduce((sum, stock) => sum + stock.value, 0)
        setTotalAssets(total)
      } catch (error) {
        console.error('Error fetching purchases:', error)
      }
    }

    fetchPurchases()
  }, [])

  // Calculate progress percentage
  const progressPercentage = Math.min((totalAssets / targetAmount) * 100, 100)

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
              <p className="text-4xl font-bold text-purple-500">₹{totalAssets.toLocaleString('en-IN')}</p>
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
              <p className="text-lg font-semibold text-white">₹{targetAmount.toLocaleString('en-IN')}</p>
              <p className="text-lg font-semibold text-green-500">{progressPercentage.toFixed(0)}% to Target</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Cards */}
        <div className="grid gap-4 md:grid-cols-1">
          <h2 className="text-lg font-medium text-green-500 mb-4">Your Funded Stock</h2>
          {purchasedStocks.map((stock) => (
            <Card
              key={stock.name}
              className="bg-[#1C1C1C] border-[#2C2C2C] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
              onClick={() => router.push(`/stock?name=${encodeURIComponent(stock.name)}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-4">
                    <div className="pt-2">
                      <h3 className="text-2xl font-bold text-white tracking-tight hover:text-purple-400 transition-colors">
                        {stock.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Quantity: {stock.quantity}</p>
                  </div>
                  {stock.trend === 'up' ? (
                    <TrendingUpIcon className="w-6 h-6 text-green-500" />
                  ) : (
                    <TrendingDownIcon className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
                  <p className="text-xl font-bold text-green-500">{stock.value}</p>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-2 transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/sell?name=${encodeURIComponent(stock.name)}&quantity=${stock.quantity}&value=${stock.value}`)
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

