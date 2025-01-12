'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import BackgroundIcons from '@/components/BackgroundIcons'

export default function PaymentSuccess() {
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
          <CheckCircle className="w-24 h-24 text-emerald-500" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-zinc-400">
            Your transaction has been processed
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: "linear" }}
            className="h-1 bg-emerald-500 mt-8 rounded-full"
          />
        </motion.div>
      </div>
    </div>
  )
}
