'use client';

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Bookmark } from 'lucide-react';
import { ErrorBoundary } from "react-error-boundary";
import PropTypes from "prop-types";
import { usePriceGenerator } from "./PriceGenerator";
import MostLiked from './features/MostLiked';
import MostBought from './features/MostBought';

function LoadingHeader() {
  return (
    <div className="p-6 bg-[#1C1C1C] rounded-lg animate-pulse">
      <div className="flex justify-between items-start">
        <div>
          <div className="h-10 w-48 bg-gray-700 rounded mb-2" />
          <div className="h-6 w-36 bg-gray-700 rounded mb-2" />
          <div className="flex items-center mt-2">
            <div className="h-8 w-24 bg-gray-700 rounded mr-2" />
            <div className="h-6 w-16 bg-gray-700 rounded" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="h-6 w-6 bg-gray-700 rounded" />
          <div className="h-6 w-6 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

function ErrorHeader({ error }) {
  return (
    <div className="p-6 bg-[#1C1C1C] rounded-lg">
      <div className="text-red-400">
        {error?.message || "Failed to load stock data. Please try again later."}
      </div>
    </div>
  );
}

ErrorHeader.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
};

// Wrap the content that uses useSearchParams in a separate component
function StockContent() {
  const searchParams = useSearchParams();
  const stockName = searchParams.get("name") || "Unknown Stock";
  const price = usePriceGenerator();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change) => {
    const isPositive = change >= 0;
    return (
      <span className={`ml-2 ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? "+" : ""}
        {change.toFixed(2)}%
      </span>
    );
  };

  const change = ((price - 175) / 175) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-[#1C1C1C] rounded-lg"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white">{stockName}</h1>
          <div className="flex items-center mt-2">
            <span className="text-3xl font-semibold text-white">
              {formatPrice(price)}
            </span>
            {formatChange(change)}
          </div>
        </div>
        <div className="flex gap-4">
          <MostLiked />
          <MostBought />
        </div>
      </div>
    </motion.div>
  );
}

// Main component with proper Suspense boundaries
export default function StockHeader() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHeader}>
      <Suspense fallback={<LoadingHeader />}>
        <StockContent />
      </Suspense>
    </ErrorBoundary>
  );
}

