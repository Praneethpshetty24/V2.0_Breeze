'use client';

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";
import { usePriceGenerator } from "./PriceGenerator";

// Loading state component
function LoadingState() {
  return (
    <div className="flex flex-col items-center mt-6">
      <div className="h-8 w-48 bg-gray-700 rounded mb-4 animate-pulse" />
      <div className="h-10 w-32 bg-gray-700 rounded animate-pulse" />
    </div>
  );
}

// Main content component that uses useSearchParams
function FundButtonContent() {
  const router = useRouter();
  const price = usePriceGenerator();
  const searchParams = useSearchParams();
  const stockName = searchParams.get("name") || "Unknown Stock";

  const handleFundClick = () => {
    router.push(`/fund?price=${price}&name=${encodeURIComponent(stockName)}`);
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <motion.div
        key={price}
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        }}
        className="text-2xl font-bold mb-4"
        style={{
          color: "white",
          background: "linear-gradient(90deg, #9333EA, #7C2DC7, #9333EA)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {stockName}: ₹{price.toFixed(2)}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <Button
          size="lg"
          className="w-full md:w-auto bg-[#9333EA] text-white hover:bg-[#7C2DC7] transition-colors duration-200"
          onClick={handleFundClick}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Fund Account
        </Button>
      </motion.div>
    </div>
  );
}

// Main component with Suspense boundary
export default function FundButton() {
  return (
    <Suspense fallback={<LoadingState />}>
      <FundButtonContent />
    </Suspense>
  );
}
