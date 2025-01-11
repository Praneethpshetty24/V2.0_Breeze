'use client'

import { motion } from 'framer-motion'

const metrics = [
  { label: 'P/E Ratio', value: '28.5' },
  { label: 'Market Cap', value: '$2.8T' },
  { label: '52W High', value: '$198.23' },
  { label: '52W Low', value: '$124.17' },
]

export default function StockMetrics() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-[#1C1C1C] p-4 rounded-lg"
        >
          <p className="text-sm text-gray-400">{metric.label}</p>
          <p className="text-xl font-semibold mt-1 text-white">{metric.value}</p>
        </motion.div>
      ))}
    </div>
  )
}

