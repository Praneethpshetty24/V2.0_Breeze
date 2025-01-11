import { motion } from "framer-motion";
import { Gem } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
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
          className="mb-8"
        >
          <Gem className="h-16 w-16 text-violet-400 mx-auto" />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400">
          Stock Funding Made Simple
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Experience the future of stock investment with our innovative
          funding platform
        </p>
      </motion.div>
    </section>
  );
}

