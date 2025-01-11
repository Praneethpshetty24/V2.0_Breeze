import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      {/* Most Liked Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-400">Most Liked</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            variants={itemVariants}
            className="bg-[#1E1E1E] p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all"
          >
            <FaHeart className="text-green-400 text-2xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Top Performer #1</h3>
            <p className="text-gray-400">High engagement metrics</p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-[#1E1E1E] p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all"
          >
            <FaStar className="text-green-400 text-2xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Top Performer #2</h3>
            <p className="text-gray-400">Rising star</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Most Bought Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-400">Most Bought</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            variants={itemVariants}
            className="bg-[#1E1E1E] p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all"
          >
            <FaShoppingCart className="text-green-400 text-2xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Popular Stock #1</h3>
            <p className="text-gray-400">High trading volume</p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-[#1E1E1E] p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all"
          >
            <FaChartLine className="text-green-400 text-2xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Popular Stock #2</h3>
            <p className="text-gray-400">Trending upward</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Start Funding Here Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mt-16"
      >
        <h2 className="text-4xl font-bold mb-8 text-center text-green-400">
      
          Start Funding Here
        
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <a href="/stock" key={item}>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="aspect-square bg-[#1E1E1E] rounded-lg flex items-center justify-center border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
              >
                <div className="text-center">
                  <FaChartLine className="text-green-400 text-3xl mb-2 mx-auto" />
                  <span className="text-sm text-gray-400">Stock {item}</span>
                </div>
              </motion.div>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
