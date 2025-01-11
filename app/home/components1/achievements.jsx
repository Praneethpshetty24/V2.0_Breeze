'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Target, TrendingUp, Heart, Star } from 'lucide-react'

export default function Achievements() {
  const achievements = [
    {
      title: "2nd Place",
      name: "Ram",
      icon: Target,
      delay: 0.2,
    },
    {
      title: "1st Place",
      name: "Raj",
      icon: Trophy,
      delay: 0,
    },
    {
      title: "3rd Place",
      name: "John",
      icon: TrendingUp,
      delay: 0.4,
    },
  ]

  return (
    <div className="px-4 py-4">
       <h1 className="text-2xl md:text-4xl font-bold text-center mb-2 text-green-500"> {/* Reduced mb-6 to mb-2 */}
        Top Funding Profiles
      </h1>
      
      <div className="relative flex flex-col md:flex-row justify-center items-center md:items-end gap-4 min-h-[20rem] mb-6 md:mb-8"> 
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: achievement.delay, duration: 0.5 }}
            className={`w-full md:w-72 ${
              index === 1
                ? 'md:mb-20 md:scale-110'
                : 'md:scale-90'
            }`}
          >
            <Card className="hover:shadow-lg transition-shadow bg-black border-gray-800 mx-auto max-w-sm md:max-w-none">
              <CardHeader className="text-center p-4 md:p-6">
                <div className="mx-auto mb-3 md:mb-4">
                  <achievement.icon
                    className={`w-8 h-8 md:w-12 md:h-12 ${
                      index === 1
                        ? 'text-yellow-500'
                        : index === 0
                          ? 'text-gray-400'
                          : 'text-amber-600'
                    }`}
                  />
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold mb-2 text-white">
                  {achievement.name}
                </CardTitle>
                <p className="text-base md:text-lg font-medium text-green-500">
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
        <p className="text-lg md:text-2xl text-green-500 font-semibold flex flex-wrap items-center justify-center gap-2">
          <Heart className="w-6 h-6 md:w-8 md:h-8" />
          Thank you for your amazing contributions!
          <Star className="w-6 h-6 md:w-8 md:h-8" />
        </p>
      </motion.div>
    </div>
  )
}