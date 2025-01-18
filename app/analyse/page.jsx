'use client'

import React, { useEffect, useState } from 'react';
import { db, auth } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
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
import { FaChartLine, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AnalysisPage() {
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
                backgroundColor: 'rgba(0, 255, 127, 0.1)',
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

  const formatSummary = (text) => {
    if (!text) return [];
    return text.split('\n').map((line, index) => {
      if (line.startsWith('###')) {
        return { type: 'heading', content: line.replace('###', '').trim() };
      }
      return { type: 'content', content: line };
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8">
          <Link href="/home" className="text-2xl font-bold text-purple-500">
            Breeze
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/home" className="text-gray-400 hover:text-white">
              Home
            </Link>
          </div>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center mb-8">
            <FaChartLine className="text-3xl text-[#00ff7f] mr-3" />
            <h1 className="text-3xl font-bold">Stock Purchase Analysis</h1>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <FaSpinner className="animate-spin text-4xl text-[#00ff7f] mb-4" />
              <p className="text-gray-400 text-lg">Analyzing your purchases...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-xl border border-gray-800 p-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-[#00ff7f]">Purchase Trends</h2>
                {chartData && (
                  <div className="h-[400px]">
                    <Line 
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            labels: {
                              color: '#fff'
                            }
                          },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            padding: 12,
                            titleFont: {
                              size: 14,
                              weight: 'bold'
                            },
                            bodyFont: {
                              size: 13
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                              color: '#fff'
                            },
                            title: {
                              display: true,
                              text: 'Purchase Value (₹)',
                              color: '#fff',
                              font: {
                                size: 12,
                                weight: 'bold'
                              }
                            }
                          },
                          x: {
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                              color: '#fff'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </motion.div>

              {/* Analysis Summary Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-xl border border-gray-800 p-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-[#00ff7f]">Analysis Summary</h2>
                <div className="space-y-4">
                  {formatSummary(summary).map((item, index) => (
                    <div 
                      key={index} 
                      className={`${
                        item.type === 'heading' 
                          ? 'text-lg font-semibold text-[#00ff7f] mt-6' 
                          : 'text-gray-300 ml-6'
                      }`}
                    >
                      {item.content}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AnalysisPage;

