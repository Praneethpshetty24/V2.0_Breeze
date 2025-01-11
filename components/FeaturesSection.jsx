import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, LineChart, PieChart, DollarSign, Activity, Shield, Globe, Clock, BarChartIcon as ChartBar } from 'lucide-react';

export default function BackgroundIcons() {
  const [backgroundIcons, setBackgroundIcons] = useState([]);

  useEffect(() => {
    const generateRandomPosition = () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
    });

    const icons = [
      TrendingUp,
      LineChart,
      PieChart,
      DollarSign,
      Activity,
      Shield,
      Globe,
      Clock,
      ChartBar,
    ].map((Icon, index) => ({
      Icon,
      ...generateRandomPosition(),
      delay: index * 0.2,
    }));

    setBackgroundIcons(icons);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {backgroundIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-violet-500/100"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 30, 0],
            rotate: [0, item.rotation, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8,
            delay: item.delay,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <item.Icon size={item.scale * 40} />
        </motion.div>
      ))}
    </div>
  );
}

