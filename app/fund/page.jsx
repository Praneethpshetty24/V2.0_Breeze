'use client';

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BackgroundIcons from '@/components/BackgroundIcons';
import { useSearchParams } from 'next/navigation';
import {db, auth} from '@/firebase'
import { collection, addDoc, serverTimestamp, getDocs, query, where, updateDoc } from 'firebase/firestore';

const BuyPageContent = () => {
  const searchParams = useSearchParams();
  const passedPrice = parseFloat(searchParams.get('price')) || 182.63;
  const stockName = searchParams.get('name') || "Unknown Stock";
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleBuyNowClick = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Please login to make a purchase');
      }
      
      // Check if user already has this stock
      const purchasesRef = collection(db, 'purchases');
      const existingPurchaseSnapshot = await getDocs(query(
        purchasesRef,
        where('userId', '==', user.uid),
        where('stockName', '==', stockName)
      ));

      let purchaseRef;
      
      if (!existingPurchaseSnapshot.empty) {
        // Update existing purchase
        const existingDoc = existingPurchaseSnapshot.docs[0];
        const existingQuantity = existingDoc.data().quantity;
        purchaseRef = existingDoc.ref;
        
        await updateDoc(purchaseRef, {
          quantity: existingQuantity + quantity,
          totalAmount: Number((passedPrice * (existingQuantity + quantity)).toFixed(2)),
          timestamp: serverTimestamp(),
        });
      } else {
        // Create new purchase
        purchaseRef = await addDoc(collection(db, 'purchases'), {
          userId: user.uid,
          stockName: stockName,
          quantity: quantity,
          price: passedPrice,
          totalAmount: Number((passedPrice * quantity).toFixed(2)),
          timestamp: serverTimestamp(),
        });
      }
      
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity,
          unitPrice: Math.round(passedPrice * 100),
          stockName: stockName,
          purchaseId: purchaseRef.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment session creation failed');
      }

      if (data.url) {
        // Add query parameters to success URL
        const successUrl = new URL(data.url);
        successUrl.searchParams.append('stockName', stockName);
        successUrl.searchParams.append('quantity', quantity.toString());
        successUrl.searchParams.append('price', passedPrice.toString());
        window.location.href = successUrl.toString();
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundIcons />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border-0 p-8 rounded-2xl shadow-2xl">
          <div className="h-1 w-20 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full mb-6" />

          <div className="space-y-8">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
                  <h2 className="text-2xl font-bold">{stockName}</h2>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">
                    ₹{passedPrice.toFixed(2)}
                  </span>
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
                  ₹{(passedPrice * quantity).toFixed(2)}
                </motion.div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white py-6 text-lg font-medium rounded-xl shadow-lg shadow-[#8B5CF6]/20"
                onClick={handleBuyNowClick}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Buy Now'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            {error && (
              <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

const BuyPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <BuyPageContent />
  </Suspense>
);

export default BuyPage;

