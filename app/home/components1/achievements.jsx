'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Target, TrendingUp, Heart, Star } from 'lucide-react'

export default function Achievements() {
  const achievements = [
    {
      title: "2nd Place",
      name: "Michael Chen",
      icon: Target,
      delay: 0.2,
    },
    {
      title: "1st Place",
      name: "Sarah Johnson",
      icon: Trophy,
      delay: 0,
    },
    {
      title: "3rd Place",
      name: "Alex Rodriguez",
      icon: TrendingUp,
      delay: 0.4,
    },
  ]

  return (
    <div className="px-4 py-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-500">
        Top Funding Profiles
      </h1>
      
      <div className="relative flex justify-center items-end gap-4 h-72 mb-8">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: achievement.delay, duration: 0.5 }}
            className={`${
              index === 1 
                ? 'mb-20 scale-110' 
                : 'scale-90'
            }`}
          >
            <Card className="hover:shadow-lg transition-shadow w-72 bg-black border-gray-800">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <achievement.icon 
                    className={`w-12 h-12 ${
                      index === 1 
                        ? 'text-yellow-500' 
                        : index === 0 
                          ? 'text-gray-400' 
                          : 'text-amber-600'
                    }`}
                  />
                </div>
                <CardTitle className="text-2xl font-bold mb-2 text-white">
                  {achievement.name}
                </CardTitle>
                <p className="text-lg font-medium text-green-500">
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
        className="text-center"
      >
        <p className="text-2xl text-green-500 font-semibold flex items-center justify-center gap-2">
          <Heart className="w-8 h-8" /> 
          Thank you for your amazing contributions! 
          <Star className="w-8 h-8" />
        </p>
      </motion.div>
    </div>
  )
}