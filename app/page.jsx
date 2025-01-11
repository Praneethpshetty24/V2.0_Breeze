"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import BackgroundIcons from "@/components/BackgroundIcons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-violet-900">
      <Navbar />

      <BackgroundIcons />

      <main className="relative">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
}

