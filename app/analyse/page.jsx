'use client'

import React, { useEffect, useState } from 'react';
import { db, auth } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from './components2/Navbar';
import ChartSection from './components2/ChartSection';
import AnalysisSummary from './components2/AnalysisSummary';
import LoadingSpinner from './components2/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalysisPage() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setAuthLoading(false);
      } else {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      if (authLoading) return;

      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error('User not authenticated');
        }

        // Fetch purchases from Firebase
        const purchasesRef = collection(db, 'purchases');
        const userPurchasesQuery = query(purchasesRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(userPurchasesQuery);
        
        const purchases = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (purchases.length === 0) {
          setSummary('No purchase data available to analyze.');
          setLoading(false);
          return;
        }

        // Process purchases
        const processedPurchases = purchases.map((purchase, index) => {
          return {
            stockName: purchase.stockName || `Stock ${index + 1}`,
            price: typeof purchase.price === 'number' ? purchase.price : 0,
            quantity: typeof purchase.quantity === 'number' ? purchase.quantity : 0,
            totalAmount: typeof purchase.totalAmount === 'number' ? purchase.totalAmount : 0,
            timestamp: purchase.timestamp || new Date()
          };
        });

        // Sort purchases by timestamp
        const sortedPurchases = processedPurchases.sort((a, b) => {
          let dateA, dateB;
          
          try {
            if (a.timestamp && a.timestamp.seconds) {
              dateA = new Date(a.timestamp.seconds * 1000);
            } else if (a.timestamp && a.timestamp.toDate) {
              dateA = a.timestamp.toDate();
            } else if (a.timestamp instanceof Date) {
              dateA = a.timestamp;
            } else {
              dateA = new Date();
            }
          } catch (e) {
            console.log('Error parsing timestamp A:', e);
            dateA = new Date();
          }
          
          try {
            if (b.timestamp && b.timestamp.seconds) {
              dateB = new Date(b.timestamp.seconds * 1000);
            } else if (b.timestamp && b.timestamp.toDate) {
              dateB = b.timestamp.toDate();
            } else if (b.timestamp instanceof Date) {
              dateB = b.timestamp;
            } else {
              dateB = new Date();
            }
          } catch (e) {
            console.log('Error parsing timestamp B:', e);
            dateB = new Date();
          }
          
          return dateA - dateB;
        });

        // Generate chart data
        const chartLabels = sortedPurchases.map((p, index) => {
          let dateStr;
          try {
            let date;
            if (p.timestamp && p.timestamp.seconds) {
              date = new Date(p.timestamp.seconds * 1000);
            } else if (p.timestamp && p.timestamp.toDate) {
              date = p.timestamp.toDate();
            } else if (p.timestamp instanceof Date) {
              date = p.timestamp;
            } else {
              date = new Date();
            }
            
            dateStr = date.toLocaleString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: 'Asia/Kolkata'
            });
          } catch (e) {
            console.log(`Error formatting chart label for index ${index}:`, e);
            dateStr = `Purchase ${index + 1}`;
          }
          return dateStr;
        });

        const chartValues = sortedPurchases.map(p => p.totalAmount);

        // Set chart data
        setChartData({
          labels: chartLabels,
          datasets: [{
            label: 'Purchase Values Over Time',
            data: chartValues,
            fill: true,
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            borderColor: '#00ff7f',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#00ff7f',
            pointBorderColor: '#000',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#00ff7f'
          }]
        });

        // Generate purchase summary
        if (sortedPurchases.length > 0) {
          // Calculate summary statistics
          const totalTransactions = sortedPurchases.length;
          const totalValue = sortedPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
          const averageValue = totalValue / totalTransactions;
          
          // Find most frequently traded stocks
          const stockCounts = {};
          sortedPurchases.forEach(p => {
            stockCounts[p.stockName] = (stockCounts[p.stockName] || 0) + 1;
          });
          
          const mostTradedStocks = Object.entries(stockCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([stock, count]) => `${stock} (${count} transactions)`);
          
          // Find highest value transactions
          const highestValueTransactions = [...sortedPurchases]
            .sort((a, b) => b.totalAmount - a.totalAmount)
            .slice(0, 3)
            .map(p => `${p.stockName}: ₹${p.totalAmount.toFixed(2)}`);
          
          // Generate summary text
          const summaryText = `
## 📊 Transaction Overview
- Total number of transactions: ${totalTransactions}
- Total value traded: ₹${totalValue.toFixed(2)}
- Average transaction value: ₹${averageValue.toFixed(2)}

## 🔍 Stock Analysis
- Most frequently traded stocks:
  - ${mostTradedStocks.join('\n  - ') || 'No data available'}
- Highest value transactions:
  - ${highestValueTransactions.join('\n  - ') || 'No data available'}

## 💡 Trading Patterns
- Your trading activity shows ${totalTransactions} transactions with a total value of ₹${totalValue.toFixed(2)}.
- The average transaction value is ₹${averageValue.toFixed(2)}.
- ${mostTradedStocks[0] ? `You trade ${mostTradedStocks[0].split(' ')[0]} most frequently.` : ''}

`;
          
          setSummary(summaryText);
        } else {
          setSummary('No purchase data available to analyze.');
        }
      } catch (error) {
        console.error('Error:', error);
        setSummary('Error analyzing purchases: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndAnalyze();
  }, [authLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center mb-8">
            <FaChartLine className="text-3xl text-[#00ff7f] mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-[#00ff7f] text-transparent bg-clip-text">
              Stock Purchase Analysis
            </h1>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartSection chartData={chartData} />
              <AnalysisSummary summary={summary} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

