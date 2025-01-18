import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

export default function ChartSection({ chartData }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 p-6 shadow-xl"
    >
      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-[#00ff7f] text-transparent bg-clip-text">
        Purchase Trends
      </h2>
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
  );
}

