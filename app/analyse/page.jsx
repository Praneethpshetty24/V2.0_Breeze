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

        const purchasesRef = collection(db, 'purchases');
        const userPurchasesQuery = query(purchasesRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(userPurchasesQuery);
        
        const purchases = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const response = await fetch('/api/analyse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ purchases }),
        });

        const data = await response.json();
        if (data.success) {
          setSummary(data.summary);
          if (data.chartData) {
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
          }
        } else {
          setSummary('Failed to generate summary');
        }
      } catch (error) {
        console.error('Error:', error);
        setSummary('Error analyzing purchases');
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

