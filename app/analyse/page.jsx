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
import { FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from './components2/Navbar';
import ChartSection from './components2/ChartSection';
import AnalysisSummary from './components2/AnalysisSummary';
import LoadingSpinner from './components2/LoadingSpinner';

// Register Chart.js components
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
  const router = useRouter();
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [purchases, setPurchases] = useState([]);

  // Handle authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setAuthLoading(false);
      } else {
        setAuthLoading(false);
        router.push('/auth');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch purchases data
  useEffect(() => {
    const fetchPurchases = async () => {
      if (authLoading) return;

      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error('User not authenticated');
        }

        setLoading(true);
        setError(null);

        const purchasesRef = collection(db, 'purchases');
        const userPurchasesQuery = query(purchasesRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(userPurchasesQuery);
        
        const purchasesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPurchases(purchasesData);
        
        if (purchasesData.length === 0) {
          setError('No purchase data found. Make some purchases to see analysis.');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
        setError('Failed to fetch purchase data. Please try again later.');
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [authLoading]);

  // Analyze purchases when data is available
  useEffect(() => {
    const analyzePurchases = async () => {
      if (purchases.length === 0 || error) return;
      
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/analyse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ purchases }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to analyze purchases');
        }

        const data = await response.json();
        
        if (data.success) {
          setSummary(data.summary);
          
          if (data.chartData && data.chartData.labels && data.chartData.values) {
            setChartData({
              labels: data.chartData.labels,
              datasets: [{
                label: 'Purchase Values Over Time',
                data: data.chartData.values,
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
          } else {
            console.warn('Invalid chart data received from API');
          }
        } else {
          throw new Error(data.error || 'Failed to generate summary');
        }
      } catch (error) {
        console.error('Analysis error:', error);
        setError(error.message || 'Error analyzing purchases. Please try again later.');
        // Keep any existing summary/chart data if available
      } finally {
        setLoading(false);
      }
    };

    if (purchases.length > 0 && !error) {
      analyzePurchases();
    }
  }, [purchases]);

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // This will trigger the useEffect to fetch and analyze again
    setPurchases([]);
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

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
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 p-8 shadow-xl text-center"
            >
              <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-4">Analysis Error</h2>
              <p className="text-gray-300 mb-6">{error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
              >
                Retry Analysis
              </button>
            </motion.div>
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

