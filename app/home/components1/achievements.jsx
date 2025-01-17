'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Target, TrendingUp, Heart, Star, Frown, Crown, Sparkles } from 'lucide-react'
import { db, auth } from '@/firebase'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

export default function Achievements() {
  const [topUsers, setTopUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchTopUsers() {
      try {
        const purchasesRef = collection(db, 'purchases')
        const purchasesSnapshot = await getDocs(purchasesRef)
        
        const userQuantities = {}
        purchasesSnapshot.forEach((doc) => {
          const data = doc.data()
          if (data.userId) {
            userQuantities[data.userId] = (userQuantities[data.userId] || 0) + data.quantity
          }
        })
        
        const sortedUsers = Object.entries(userQuantities)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
        
        const usersData = sortedUsers.map(([userId, quantity]) => ({
          userId,
          name: `User ${userId.slice(0, 5)}`,
          quantity
        }))
        
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const updatedUsers = usersData.map(userData => ({
              ...userData,
              name: userData.userId === user.uid ? (user.displayName || user.email || 'Anonymous') : userData.name
            }))
            setTopUsers(updatedUsers)
          } else {
            setTopUsers(usersData)
          }
        })
        
      } catch (error) {
        console.error('Error fetching data:', error)
        setTopUsers([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchTopUsers()
  }, [])

  // Reorder array to put 1st place in the middle
  const orderedUsers = topUsers.length === 3 ? [topUsers[1], topUsers[0], topUsers[2]] : topUsers

  const achievements = orderedUsers.map((user, index) => ({
    title: `${index === 1 ? '1st' : index === 0 ? '2nd' : '3rd'} Place`,
    name: user.name,
    icon: index === 1 ? Trophy : index === 0 ? Target : TrendingUp,
    delay: index === 1 ? 0 : index === 0 ? 0.2 : 0.4,
  }))

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-12 text-[#00ff66]">
        Top Funding Profiles
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[20rem]">
          <div className="animate-spin text-[#00ff66]">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>
      ) : topUsers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[20rem] text-[#00ff66] space-y-4"
        >
          <div className="text-2xl font-semibold flex items-center gap-3">
            <Crown className="w-6 h-6" />
            Nothing to display yet
            <Crown className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2 text-lg">
            <Frown className="w-5 h-5" />
            Be the first to contribute!
            <Sparkles className="w-5 h-5" />
          </div>
        </motion.div>
      ) : (
        <>
          <div className="relative flex flex-col md:flex-row justify-center items-center md:items-end gap-8 min-h-[20rem] mb-12">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: achievement.delay, duration: 0.5 }}
                className={`w-full md:w-72 ${
                  index === 1
                    ? 'md:mb-0 md:scale-125 z-10'
                    : 'md:scale-90'
                }`}
              >
                <Card className="hover:shadow-lg transition-shadow bg-black border border-gray-800 mx-auto max-w-sm md:max-w-none overflow-hidden">
                  <CardHeader className="text-center p-6">
                    <div className="mx-auto mb-4">
                      <achievement.icon
                        className={`w-12 h-12 ${
                          index === 1
                            ? 'text-yellow-400'
                            : index === 0
                              ? 'text-gray-400'
                              : 'text-orange-500'
                        }`}
                      />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-3 text-white">
                      {achievement.name}
                    </CardTitle>
                    <p className="text-lg font-medium text-[#00ff66]">
                      {achievement.title}
                    </p>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center px-4"
          >
            <p className="text-xl text-[#00ff66] font-semibold flex flex-wrap items-center justify-center gap-3">
              <Heart className="w-6 h-6" />
              Thank you for your amazing contributions!
              <Star className="w-6 h-6" />
            </p>
          </motion.div>
        </>
      )}
    </div>
  )
}