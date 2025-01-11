'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { PlusIcon } from 'lucide-react'

export default function FundButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center mt-6"
    >
      <Button 
        size="lg" 
        className="w-full md:w-auto bg-[#9333EA] text-white hover:bg-[#7C2DC7]"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        Fund Account
      </Button>
    </motion.div>
  )
}

