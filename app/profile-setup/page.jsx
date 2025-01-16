'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiCreditCard, 
  FiShield, 
  FiClock, 
  FiCheck, 
  FiLock,
  FiDatabase,
  FiTrendingUp,
  FiPieChart,
  FiBarChart2,
  FiDollarSign,
  FiActivity,
  FiTarget
} from 'react-icons/fi'
import { Loading } from '@/components/ui/loading'
import { db, auth } from '@/firebase'
import { collection, addDoc, serverTimestamp, doc, setDoc, query, where, getDocs, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

export default function PANCardVerification() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [panNumber, setPanNumber] = useState('')
  const router = useRouter()
  
  useEffect(() => {
    const checkPANVerification = async () => {
      const user = auth.currentUser
      if (!user) {
        router.push('/login')
        return
      }

      const docRef = doc(db, 'data', user.uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists() && docSnap.data().panNumber) {
        router.push('/home')
      }
    }

    checkPANVerification()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const user = auth.currentUser
      if (!user) {
        console.error('User is not authenticated')
        return
      }

      // Validate PAN number format (basic validation)
      if (panNumber.length !== 10) {
        alert('PAN number must be 10 characters long')
        setIsSubmitting(false)
        return
      }

      // Check if PAN already exists for any user
      const panQuery = query(collection(db, 'data'), where('panNumber', '==', panNumber))
      const panQuerySnapshot = await getDocs(panQuery)
      
      if (!panQuerySnapshot.empty) {
        alert('This PAN number is already registered')
        setIsSubmitting(false)
        return
      }

      // Store in 'data' collection
      const docRef = doc(db, 'data', user.uid)
      await setDoc(docRef, {
        panNumber: panNumber,
        timestamp: serverTimestamp(),
        verified: true
      }, { merge: true })
      
      console.log('PAN Card verified and stored successfully')
      setPanNumber('')
      router.push('/home')
      
    } catch (error) {
      console.error('Error verifying PAN Card:', error)
      alert('Error verifying PAN Card. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const backgroundIcons = [
    { Icon: FiTrendingUp, position: 'top-20 left-10', size: 'text-xl' },
    { Icon: FiPieChart, position: 'top-40 right-20', size: 'text-2xl' },
    { Icon: FiBarChart2, position: 'bottom-32 left-24', size: 'text-3xl' },
    { Icon: FiDollarSign, position: 'top-1/3 right-12', size: 'text-xl' },
    { Icon: FiActivity, position: 'bottom-20 right-16', size: 'text-2xl' },
    { Icon: FiTarget, position: 'top-1/4 left-1/3', size: 'text-xl' },
    { Icon: FiTrendingUp, position: 'bottom-1/4 right-1/3', size: 'text-2xl' },
    { Icon: FiPieChart, position: 'top-2/3 left-16', size: 'text-xl' },
    { Icon: FiBarChart2, position: 'bottom-1/3 right-24', size: 'text-2xl' },
    { Icon: FiActivity, position: 'top-16 right-1/4', size: 'text-xl' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex items-start justify-center relative overflow-hidden pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -right-10 bottom-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
        
        {/* Background Icons */}
        {backgroundIcons.map(({ Icon, position, size }, index) => (
          <motion.div
            key={index}
            className={`absolute ${position} ${size} text-gray-600/70`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: Math.random() * 2 + 1
            }}
          >
            <Icon />
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-lg px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <FiDatabase className="text-6xl text-purple-500" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Data Verification
          </h1>
          <div className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-300">
            <FiClock className="text-pink-500" />
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Verification under 30 seconds
            </h2>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-800"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <FiShield className="text-2xl text-purple-500" />
                <span className="text-lg font-semibold text-gray-300">Enter PAN Details</span>
              </div>
              <div className="relative">
                <FiCreditCard className="absolute left-4 top-4 text-2xl text-purple-500" />
                <input
                  type="text"
                  placeholder="Enter PAN Card Number"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-950/80 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-400 text-lg border border-gray-800"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FiLock className="text-xl" />
                  Verifying...
                </>
              ) : (
                <>
                  <FiCheck className="text-xl" />
                  Verify PAN Card
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
      
      <Loading isLoading={isSubmitting} />
    </div>
  )
}

