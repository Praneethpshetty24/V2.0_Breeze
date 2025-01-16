import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { db } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';

function MostLiked() {
  const [isLiked, setIsLiked] = useState(false);
  const searchParams = useSearchParams();
  const stockName = searchParams.get('name');

  // Fetch initial like state from Firebase
  useEffect(() => {
    const fetchLikeState = async () => {
      const docRef = doc(db, 'stockLikes', stockName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIsLiked(docSnap.data().isLiked);
      }
    };
    if (stockName) {
      fetchLikeState();
    }
  }, [stockName]);

  const handleLikeClick = async () => {
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    
    // Update Firebase
    const docRef = doc(db, 'stockLikes', stockName);
    await setDoc(docRef, {
      stockName: stockName,
      isLiked: newLikeState,
      updatedAt: new Date()
    });
  };

  return (
    <button
      className={`${
        isLiked ? 'text-red-500' : 'text-gray-400'
      } hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:ring-offset-2 focus:ring-offset-[#1C1C1C] rounded-full p-1`}
      aria-label="Like stock"
      onClick={handleLikeClick}
    >
      <Heart className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
    </button>
  );
}

export default MostLiked;