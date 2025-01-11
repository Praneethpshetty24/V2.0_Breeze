'use client'

import { motion } from 'framer-motion'
import { ErrorBoundary } from 'react-error-boundary'
import StockHeader from './components/StockHeader'
import StockMetrics from './components/StockMetrics'
import PriceChart from './components/PriceChart'
import TimeframeButtons from './components/TimeframeButtons'
import ProfitLoss from './components/ProfitLoss'
import FundButton from './components/FundButton'

function ErrorFallback({ error }) {
  return (
    <div className="text-red-500 p-4 bg-red-100 rounded-lg">
      <h2 className="text-lg font-semibold">Oops! Something went wrong:</h2>
      <p>{error.message}</p>
    </div>
  )
}

export default function StockDashboard() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#121212] text-white p-4 md:p-8"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <StockHeader />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <TimeframeButtons />
              <PriceChart />
            </div>
            <div className="md:col-span-1">
              <StockMetrics />
            </div>
          </div>
          <ProfitLoss />
          <FundButton />
        </div>
      </motion.div>
    </ErrorBoundary>
  )
}

