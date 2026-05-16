import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Radiation, ChevronRight } from "lucide-react";

const introLines = [
  "October 1962.",
  "The Cold War has reached a boiling point.",
  "Soviet nuclear missiles have been discovered in Cuba...",
  "90 miles from American soil.",
  "You are President Kennedy.",
  "The fate of the world is in your hands.",
];

export default function IntroScreen({ onStart }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (lineIndex < introLines.length) {
      const timer = setTimeout(() => setLineIndex(prev => prev + 1), 1800);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setReady(true), 800);
    }
  }, [lineIndex]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* CRT scanline effect */}
      <div className="crt-overlay" />
      
      <div className="max-w-2xl w-full px-6 text-center relative z-10">
        {/* Radiation icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <Radiation className="w-64 h-64 text-red-600" />
        </motion.div>

        {/* Intro text lines */}
        <div className="space-y-4 mb-12 min-h-[280px] flex flex-col justify-center">
          <AnimatePresence>
            {introLines.slice(0, lineIndex).map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`font-typewriter text-base md:text-lg ${
                  i === introLines.length - 1 ? "text-red-400 text-xl md:text-2xl mt-4" :
                  i >= 4 ? "text-foreground/90" : "text-foreground/60"
                }`}
              >
                {line}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>

        {/* Start button */}
        <AnimatePresence>
          {ready && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                onClick={onStart}
                size="lg"
                className="bg-red-800 hover:bg-red-700 text-white font-display tracking-[0.2em] text-lg px-8 py-6 rounded-sm"
              >
                ENTER THE SITUATION ROOM
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="font-mono text-[10px] text-muted-foreground mt-4 tracking-wider">
                A simulation for 1-5 players sharing one screen
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
