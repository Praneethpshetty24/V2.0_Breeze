import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';

function MostBought() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <button
      className="text-gray-400 hover:text-[#9333EA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:ring-offset-2 focus:ring-offset-[#1C1C1C] rounded-full p-1"
      aria-label="Add to watchlist"
      onClick={() => setIsBookmarked(!isBookmarked)}
    >
      <Bookmark 
        className="w-6 h-6" 
        fill={isBookmarked ? "#9333EA" : "none"}
      />
    </button>
  );
}

export default MostBought;