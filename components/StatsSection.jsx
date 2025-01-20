import React from 'react';
import { DollarSign, Clock, Target, Users, Shield, Zap } from 'lucide-react';

const stats = [
  {
    value: "AI Chat",
    label: "AI Assistant",
    icon: Users,
    description: "Interactive chat powered by AI"
  },
  {
    value: "AI Analyst",
    label: "Analysis",
    icon: Shield,
    description: "AI-driven market analysis"
  },
  {
    value: "High Security",
    label: "Security",
    icon: Shield,
    description: "Top-notch security measures"
  },
  {
    value: "Community",
    label: " Community",
    icon: Users,
    description: "Engage with community"
  },

];

const StatsCard = ({ value, label, Icon, description, delay }) => {
  return (
    <div className="relative group">
      {/* Gradient background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-violet-500/5 rounded-lg blur-xl transition-all duration-300 group-hover:blur-2xl" />
      
      {/* Card content with backdrop blur */}
      <div className="relative p-6 rounded-lg bg-slate-800/20 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800/30 transition-all duration-300">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-violet-500/10 rounded-lg backdrop-blur-sm">
            <Icon className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-violet-400 group-hover:text-violet-300 transition-colors">
              {value}
            </h3>
            <p className="text-gray-300 font-medium">{label}</p>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StatsSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            value={stat.value}
            label={stat.label}
            Icon={stat.icon}
            description={stat.description}
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
}