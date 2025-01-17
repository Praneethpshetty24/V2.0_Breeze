'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import BackgroundIcons from '@/components/BackgroundIcons'
import { db } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'

export default function PaymentSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState(false)
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id')
        if (!sessionId) {
          throw new Error('No session ID found')
        }

        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        const data = await response.json()
        
        if (data.success) {
          setVerifying(false)
          // Payment was successful, redirect after a delay
          setTimeout(() => {
            router.push('/home')
          }, 2500)
        } else {
          throw new Error(data.error || 'Payment verification failed')
        }
      } catch (err) {
        console.error('Error verifying payment:', err)
        setError(true)
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [router, searchParams])

  if (verifying) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center relative overflow-hidden">
        <BackgroundIcons />
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center"
          >
            <Loader2 className="w-24 h-24 text-purple-500 animate-spin" />
          </motion.div>
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Verifying Payment...
            </h1>
            <p className="text-zinc-400">
              Please wait while we confirm your transaction
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center relative overflow-hidden">
        <BackgroundIcons />
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center"
          >
            <XCircle className="w-24 h-24 text-red-500" />
          </motion.div>
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Payment Verification Failed
            </h1>
            <p className="text-zinc-400">
              Please contact support if this issue persists
            </p>
          </div>
        </div>
      </div>
    )
  }

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
