import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

export default function ConsequenceScreen({ option, onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/95 z-40 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl w-full"
      >
        {/* Impact header */}
        <div className="text-center mb-6">
          <div className="font-display text-xs tracking-[0.3em] text-secondary uppercase mb-2">
            Consequences of Your Decision
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
            {option.label}
          </h2>
        </div>

        {/* Consequence */}
        <div className="border border-border bg-card rounded-sm p-6 mb-4">
          <p className="font-typewriter text-sm md:text-base text-foreground/90 leading-relaxed">
            {option.consequence}
          </p>
        </div>

        {/* Tension change indicator */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className={`font-mono text-xs ${option.tensionChange > 0 ? "text-red-400" : "text-green-400"}`}>
            TENSION {option.tensionChange > 0 ? "▲" : "▼"} {Math.abs(option.tensionChange)}
          </div>
          <div className={`font-mono text-xs ${option.worldOpinionChange > 0 ? "text-green-400" : "text-red-400"}`}>
            WORLD OPINION {option.worldOpinionChange > 0 ? "▲" : "▼"} {Math.abs(option.worldOpinionChange)}
          </div>
        </div>

        {/* Historical note */}
        <div className="border border-secondary/30 bg-secondary/5 rounded-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-secondary" />
            <span className="font-display text-[10px] tracking-[0.2em] text-secondary uppercase">
              Historical Note
            </span>
          </div>
          <p className="text-xs font-mono text-foreground/70 leading-relaxed">
            {option.historicalNote}
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onContinue}
            className="bg-primary hover:bg-primary/90 font-display tracking-wider"
          >
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
