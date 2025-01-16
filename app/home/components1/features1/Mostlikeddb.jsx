import React, { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import SpotlightCard from "@/components/ui/SpotlightCard";

function Mostlikeddb() {
  const [topStocks, setTopStocks] = useState([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  useEffect(() => {
    const fetchMostLikedStocks = async () => {
      const stocksRef = collection(db, 'stockLikes');
      const snapshot = await getDocs(stocksRef);
      
      const stocks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const sortedStocks = stocks.sort((a, b) => 
        (b.likeCount || 0) - (a.likeCount || 0)
      );

      setTopStocks(sortedStocks.slice(0, 2));
    };

    fetchMostLikedStocks();
  }, []);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-[#00FF94]">Most Liked</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topStocks.map((stock, index) => (
          <motion.div key={stock.id} variants={itemVariants}>
            <Link 
              href={`/stock?name=${stock.stockName}`}
              className="block"
            >
              <SpotlightCard>
                <div className="bg-[#1C1C1C] rounded-lg p-6 hover:bg-[#252525] transition-all cursor-pointer h-[120px] flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-[#00FF94]" fill="#00FF94" />
                    <h3 className="text-xl font-semibold text-white">
                      {stock.stockName}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    {index === 0 ? 'High engagement metrics' : 'Rising star'}
                  </p>
                </div>
              </SpotlightCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Mostlikeddb;