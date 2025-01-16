import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import{db} from '@/firebase'

function MostLiked() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <button
      className={`${
        isLiked ? 'text-red-500' : 'text-gray-400'
      } hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:ring-offset-2 focus:ring-offset-[#1C1C1C] rounded-full p-1`}
      aria-label="Like stock"
      onClick={() => setIsLiked(!isLiked)}
    >
      <Heart className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
    </button>
  );
}

export default MostLiked;