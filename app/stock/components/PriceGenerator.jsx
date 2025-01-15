'use client'

import React, { useState, useEffect } from 'react'

export function usePriceGenerator(initialPrice = 175, minPrice = 175, maxPrice = 178) {
  const [price, setPrice] = useState(initialPrice)

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prevPrice => {
        const newPrice = prevPrice + (Math.random() - 0.5) * 0.5
        return Math.min(Math.max(newPrice, minPrice), maxPrice)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [minPrice, maxPrice])

  return price
}

