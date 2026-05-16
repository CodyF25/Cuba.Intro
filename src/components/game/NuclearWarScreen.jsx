import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Radiation, RotateCcw } from "lucide-react";

export default function NuclearWarScreen({ onRestart }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1500),
      setTimeout(() => setPhase(2), 4000),
      setTimeout(() => setPhase(3), 7000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div
            key="warning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Radiation className="w-20 h-20 text-red-600 mx-auto animate-pulse-red" />
            <h1 className="font-display text-4xl md:text-6xl font-bold text-red-600 mt-6 tracking-wider animate-pulse-red">
              NUCLEAR LAUNCH DETECTED
            </h1>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.3, 1] }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white"
          />
        )}

        {phase === 2 && (
          <motion.div
            key="aftermath"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center max-w-2xl px-6"
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold text-red-600 mb-8 tracking-wider">
              THE WORLD HAS ENDED
            </h1>
            <div className="space-y-4 text-left border border-red-900/50 bg-red-950/20 rounded-sm p-6">
              <p className="font-typewriter text-sm text-red-300/80 leading-relaxed">
                An estimated 100 million Americans and 100 million Soviet citizens perish in the first hour. 
                Nuclear winter follows, destroying global agriculture. Civilization as we know it ceases to exist.
              </p>
              <p className="font-typewriter text-sm text-red-300/80 leading-relaxed">
                In our timeline, this never happened. Kennedy and Khrushchev chose restraint over 
                destruction. Every aggressive choice that brought you here is a path that real leaders 
                refused to take — even under immense pressure.
              </p>
              <p className="font-mono text-xs text-red-400/60 mt-4">
                "I think we used to think that if there were a nuclear war, some of us would survive. 
                But now we know that no one would survive." — President John F. Kennedy
              </p>
            </div>
          </motion.div>
        )}

        {phase === 3 && (
          <motion.div
            key="options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center max-w-2xl px-6"
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold text-red-600 mb-6 tracking-wider">
              THE WORLD HAS ENDED
            </h1>
            <p className="font-typewriter text-sm text-red-300/60 mb-8">
              This is not what happened in 1962. But it could have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={onRestart} variant="outline" className="border-red-800 text-red-400 hover:bg-red-950">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
