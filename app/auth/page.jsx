"use client"
import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 
import BackgroundIcons from '@/components/BackgroundIcons';
import { useRouter } from 'next/navigation';

const provider = new GoogleAuthProvider();

const Page = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Check if user has completed profile setup
        const docRef = doc(db, 'data', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().panNumber) {
          router.push('/home');
        } else {
          router.push('/profile-setup');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
   
      setTimeout(() => {
        setLoading(false); 
        router.push('/home');
      }, 2000); 
    } catch (error) {
      console.error("Error signing in with Google", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-900 to-black">
      <BackgroundIcons className="absolute inset-0 z-0" />
      <div className="z-10 bg-white bg-opacity-10 p-8 rounded-lg backdrop-filter backdrop-blur-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Sign In.</h1>
          <button
            onClick={signInWithGoogle}
            className="bg-white text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="w-6 h-6 mr-2"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
