import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { db, auth } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

function Marked() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const updateBookmarkStatus = async (status) => {
    const userId = auth.currentUser.uid;
    const bookmarkRef = doc(db, 'bookmarks', userId);
    await setDoc(bookmarkRef, { isBookmarked: status });
  };

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      const userId = auth.currentUser.uid;
      const bookmarkRef = doc(db, 'bookmarks', userId);
    
    };
    fetchBookmarkStatus();
  }, []);

  return (
    <button
      className="text-gray-400 hover:text-[#9333EA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:ring-offset-2 focus:ring-offset-[#1C1C1C] rounded-full p-1"
      aria-label="Add to watchlist"
      onClick={() => {
        const newStatus = !isBookmarked;
        setIsBookmarked(newStatus);
        updateBookmarkStatus(newStatus);
      }}
    >
      <Bookmark 
        className="w-6 h-6" 
        fill={isBookmarked ? "#9333EA" : "none"}
      />
    </button>
  );
}

export default Marked;