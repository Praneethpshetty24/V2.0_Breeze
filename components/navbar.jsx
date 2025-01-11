import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Wind } from 'lucide-react'
import { useEffect, useState } from 'react';
import { auth } from '@/firebase';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          href="/" 
          className="flex items-center space-x-2 rounded-full p-2 hover:bg-gray-800"
          style={{ marginLeft: '-20px' }} 
        >
          <Wind className="h-8 w-8 text-violet-400" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">
            Breeze
          </span>
        </Link>

        <div className="flex items-center" style={{ marginRight: '-12px' }}>
          <Button
            className={`bg-violet-600 hover:bg-violet-700 transition-transform duration-200 ${isPressed ? 'scale-95' : ''} 
              md:px-6 md:py-3 px-4 py-2 text-sm md:text-base`}
            style={{
              borderRadius: '9999px',
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onClick={() => {
              window.location.href = user ? '/home' : '/auth';
            }}
          >
            {user ? 'Fund' : 'Sign In'}
          </Button>
        </div>
      </div>
    </nav>
  )
}
