'use client'

import React, { useEffect, useState, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import SpotlightCard from "@/components/ui/SpotlightCard";

const Mostlikeddb = lazy(() => import("./features1/Mostlikeddb"));
const Mostboughtdb = lazy(() => import("./features1/Mostboughtdb"));

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

const staticStocks = [
  { id: 3, name: "zion", type: "mostBought", icon: FaShoppingCart, description: "High trading volume" },
  { id: 4, name: "Msft", type: "mostBought", icon: FaChartLine, description: "Trending upward" },
];

const renderStaticStockCards = (type) => {
  return staticStocks
    .filter((stock) => stock.type === type)
    .map((stock) => (
      <motion.div key={stock.id} variants={itemVariants}>
        <SpotlightCard spotlightColor={type === "mostBought" ? "rgba(255, 99, 71, 0.2)" : "rgba(0, 229, 255, 0.2)"}>
          <stock.icon className="text-green-400 text-2xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">{stock.name}</h3>
          {stock.description && <p className="text-gray-400">{stock.description}</p>}
        </SpotlightCard>
      </motion.div>
    ));
};

function Home() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const CACHE_DURATION = 60000; // 1 minute cache

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        // Check cache in localStorage
        const cachedData = localStorage.getItem('stocksCache');
        const cachedTime = localStorage.getItem('stocksCacheTime');
        const now = Date.now();

        // Use cache if valid
        if (cachedData && cachedTime && (now - Number(cachedTime)) < CACHE_DURATION) {
          setStocks(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        const response = await fetch("/api/getStocks");
        const { data } = await response.json();
        
        // Update cache
        localStorage.setItem('stocksCache', JSON.stringify(data));
        localStorage.setItem('stocksCacheTime', now.toString());
        
        setStocks(data || []);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        // Fallback to cached data on error if available
        const cachedData = localStorage.getItem('stocksCache');
        if (cachedData) {
          setStocks(JSON.parse(cachedData));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-8">
        <div className="min-h-screen bg-[#121212] text-white p-8 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <FaChartLine className="text-purple-500 text-4xl" />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      {/* Most Liked Section */}
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <FaChartLine className="text-purple-500 text-4xl" />
          </motion.div>
        </div>
      }>
        <Mostlikeddb />
      </Suspense>

      {/* Most Bought Section */}
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <FaChartLine className="text-purple-500 text-4xl" />
          </motion.div>
        </div>
      }>
        <Mostboughtdb />
      </Suspense>

      {/* Start Funding Here Section */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mt-16">
        <h2 className="text-4xl font-bold mb-8 text-center text-green-400">Start Funding Here</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stocks.map((stock) => (
            <motion.div
              key={stock.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SpotlightCard spotlightColor="rgba(0, 229, 255, 0.2)">
                <a href={`/stock?name=${stock.Stock}&pe=${stock.PE}&marketCap=${stock.Market_cap}&high52w=${stock["52W_high"]}&low52w=${stock["52W_low"]}`}>
                  <div className="text-center">
                    <FaChartLine className="text-green-400 text-3xl mb-2 mx-auto" />
                    <span className="text-sm text-gray-400">{stock.Stock}</span>
                  </div>
                </a>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Home;

