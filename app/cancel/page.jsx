'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'
import BackgroundIcons from '@/components/BackgroundIcons'

export default function PaymentError() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/home')
    }, 2500)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center relative overflow-hidden">
      <BackgroundIcons />
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="flex justify-center"
        >
          <XCircle className="w-24 h-24 text-red-500" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Payment Failed
          </h1>
          <p className="text-zinc-400 mb-4">
            We encountered an issue processing your payment
          </p>
          <p className="text-zinc-500 text-sm">
            Redirecting to Home page...
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-1 bg-red-500 mt-8 rounded-full"
          />
        </motion.div>
      </div>
    </div>
  )
}
