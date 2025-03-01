import { motion } from "framer-motion";
import { Gem } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 pt-20 md:pt-32 pb-12 md:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="mb-6 md:mb-8"
        >
          <Gem className="h-12 w-12 md:h-16 md:w-16 text-violet-400 mx-auto" />
        </motion.div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400">
          Stock Funding Made Simple
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto">
          Experience the future of stock investment with our innovative
          funding platform
        </p>
        <Link href="/home">
        </Link>
      </motion.div>
    </section>
  );
}

