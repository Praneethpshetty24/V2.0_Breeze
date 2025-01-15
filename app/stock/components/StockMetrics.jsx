'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

function MetricsContent() {
  const searchParams = useSearchParams()
  
  const pe = searchParams.get('pe') || '0'
  const marketCap = searchParams.get('marketCap') || '0'
  const high52w = searchParams.get('high52w') || '0'
  const low52w = searchParams.get('low52w') || '0'

  const metrics = [
    { label: 'P/E Ratio', value: pe },
    { label: 'Market Cap', value: `₹${marketCap}.cr`},
    { label: '52W High', value: `₹${high52w}` },
    { label: '52W Low', value: `₹${low52w}` },
  ]

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

// Loading fallback
function LoadingMetrics() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-[#1C1C1C] p-4 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-20 mb-2" />
          <div className="h-6 bg-gray-700 rounded w-24" />
        </div>
      ))}
    </div>
  )
}

export default function StockMetrics() {
  return (
    <Suspense fallback={<LoadingMetrics />}>
      <MetricsContent />
    </Suspense>
  )
}

