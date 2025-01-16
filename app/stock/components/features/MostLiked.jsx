import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { db, auth } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';

function MostLiked() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const searchParams = useSearchParams();
  const stockName = searchParams.get('name');

  useEffect(() => {
    const fetchLikeState = async () => {
      const docRef = doc(db, 'stockLikes', stockName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLikeCount(data.likeCount || 0);
        setIsLiked(data.likedBy?.includes(auth.currentUser?.uid) || false);
      }
    };
    if (stockName && auth.currentUser) {
      fetchLikeState();
    }
  }, [stockName]);

  const handleLikeClick = async () => {
    if (!auth.currentUser) return; // Prevent action if user is not logged in

    const docRef = doc(db, 'stockLikes', stockName);
    const docSnap = await getDoc(docRef);
    const currentData = docSnap.exists() ? docSnap.data() : { likedBy: [], likeCount: 0 };
    
    const newLikedBy = isLiked
      ? currentData.likedBy.filter(id => id !== auth.currentUser.uid)
      : [...(currentData.likedBy || []), auth.currentUser.uid];
    
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    
    await setDoc(docRef, {
      stockName: stockName,
      likeCount: newLikeCount,
      likedBy: newLikedBy,
      updatedAt: new Date()
    });

    setIsLiked(!isLiked);
    setLikeCount(newLikeCount);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="text-red-500 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:ring-offset-2 focus:ring-offset-[#1C1C1C] rounded-full p-1"
        aria-label="Like stock"
        onClick={handleLikeClick}
      >
        <Heart className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
      </button>
      <span className="text-sm text-gray-400">{likeCount}</span>
    </div>
  );
}

export default MostLiked;