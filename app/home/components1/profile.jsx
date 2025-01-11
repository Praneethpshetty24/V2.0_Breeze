'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Edit, Settings, User } from 'lucide-react'
import { auth, db } from '@/firebase'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'

export function Profile() {
  const [user, setUser] = useState(null);
  const [panNumber, setPanNumber] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'data', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPanNumber(data.panNumber);
          } else {
            console.log("No PAN data found for user");
            setPanNumber('Not verified');
          }
        } catch (error) {
          console.error("Error fetching PAN data:", error);
          setPanNumber('Error loading');
        }
      }
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
                <p className="text-gray-400 mt-2">
                  PAN Number: {panNumber ? 
                    <span className="text-green-400">{panNumber}</span> : 
                    <span className="text-yellow-400">Not verified</span>
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

