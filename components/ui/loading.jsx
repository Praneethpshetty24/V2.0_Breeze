'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TbChartCandle } from 'react-icons/tb'

export function Loading({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-purple-500 text-6xl"
          >
            <TbChartCandle />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
