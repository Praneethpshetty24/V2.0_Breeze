"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BackgroundIcons  from '@/components/BackgroundIcons';

const BuyPage = () => {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundIcons />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6,
          ease: "easeOut"
        }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border-0 p-8 rounded-2xl shadow-2xl">
          <div className="h-1 w-20 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full mb-6" />
          
          <div className="space-y-8">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
                  <h2 className="text-2xl font-bold">AAPL</h2>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">$182.63</span>
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-green-400 text-sm"
                  >
                    +1.25%
                  </motion.span>
                </div>
              </div>
              
              <div className="px-3 py-1 bg-[#2A2A2A]/50 rounded-full">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-400">LIVE</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-400 font-medium">Quantity</label>
              <div className="flex items-center justify-between p-3 bg-[#2A2A2A]/30 backdrop-blur-sm rounded-xl">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={decrementQuantity}
                  className="p-2 rounded-lg bg-[#2A2A2A] hover:bg-[#333333] transition-colors"
                >
                  <Minus className="w-5 h-5 text-[#8B5CF6]" />
                </motion.button>
                
                <motion.div
                  key={quantity}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-mono text-2xl min-w-[3ch] text-center font-bold"
                >
                  {quantity}
                </motion.div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={incrementQuantity}
                  className="p-2 rounded-lg bg-[#2A2A2A] hover:bg-[#333333] transition-colors"
                >
                  <Plus className="w-5 h-5 text-[#8B5CF6]" />
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-400 font-medium">Total Amount</label>
              <div className="p-4 bg-[#2A2A2A]/30 backdrop-blur-sm rounded-xl">
                <motion.div 
                  key={quantity}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]"
                >
                  ${(182.63 * quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white py-6 text-lg font-medium rounded-xl shadow-lg shadow-[#8B5CF6]/20"
              >
                Buy Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default BuyPage;

