import React, { useEffect, useState } from 'react';
import { db } from '@/firebase'; // Import your Firebase configuration
import { collection, getDocs } from 'firebase/firestore';
import SpotlightCard from "@/components/ui/SpotlightCard"; // Adjust the import path as needed
import { FaShoppingCart } from 'react-icons/fa'; // Import the icon
import Link from 'next/link';
import { motion } from 'framer-motion';

function Mostboughtdb() {
  const [mostBoughtStocks, setMostBoughtStocks] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const purchasesCollection = collection(db, 'purchases'); // Adjust the collection name as needed
        const purchaseSnapshot = await getDocs(purchasesCollection);
        const purchases = purchaseSnapshot.docs.map(doc => doc.data());

        // Sort purchases by quantity and get the top two
        const topTwoStocks = purchases
          .sort((a, b) => b.quantity - a.quantity) // Sort in descending order
          .slice(0, 2); // Get the top two

        setMostBoughtStocks(topTwoStocks);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <FaShoppingCart className="w-8 h-8 text-[#00FF94] animate-spin" />
      </div>
    );
  }

  return (
    <motion.div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-[#00FF94]">Most Bought Stocks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mostBoughtStocks.length > 0 ? (
          mostBoughtStocks.map((stock, index) => (
            <motion.div key={index}>
              <Link 
                href={`/stock?name=${stock.stockName}`} // Adjust the link as needed
                className="block"
              >
                <SpotlightCard>
                  <div className="bg-[#1C1C1C] rounded-lg p-6 hover:bg-[#252525] transition-all cursor-pointer h-[120px] flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <FaShoppingCart className="w-6 h-6 text-[#00FF94]" />
                      <h3 className="text-xl font-semibold text-white">
                        {stock.stockName}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400">
                      Popular choice among investors
                    </p>
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>
          ))
        ) : (
          <p>No stocks found.</p>
        )}
      </div>
    </motion.div>
  );
}

export default Mostboughtdb;