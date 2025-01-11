'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Edit, Settings, User } from 'lucide-react'
import { auth } from '@/firebase'
import { useEffect, useState } from 'react'

export function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-[#0C0C0C] p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-4"
      >
        <Card className="bg-[#1C1C1C] border-[#2C2C2C] text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <Avatar className="h-24 w-24 bg-black flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-semibold">{user?.displayName || 'John Doe'}</h2>
                <p className="text-gray-400">{user?.email || 'john.doe@example.com'}</p>
                <p className="text-gray-400 mt-2">
                  Member since: {user ? new Date(user.metadata.creationTime).toLocaleDateString() : 'January 2023'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

