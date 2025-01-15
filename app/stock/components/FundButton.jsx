'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePriceGenerator } from './PriceGenerator'

export default function FundButton() {
  const router = useRouter()
  const price = usePriceGenerator()

  const handleFundClick = () => {
    router.push('/fund') 
  }

  return (
    <div className="flex flex-col items-center mt-6">
      <motion.div
        key={price}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-4"
      >
        Current Price: ₹{price.toFixed(2)}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <Button 
          size="lg" 
          className="w-full md:w-auto bg-[#9333EA] text-white hover:bg-[#7C2DC7]"
          onClick={handleFundClick}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Fund Account
        </Button>
      </motion.div>
    </div>
  )
}

