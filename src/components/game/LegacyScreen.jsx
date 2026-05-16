import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HISTORICAL_COMPARISON } from "@/lib/gameData";
import { RotateCcw, Landmark, ArrowRight } from "lucide-react";

export default function LegacyScreen({ onRestart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background p-4 md:p-8"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Landmark className="w-10 h-10 text-secondary mx-auto mb-3" />
          <div className="font-display text-xs tracking-[0.3em] text-secondary uppercase mb-2">
            Long-Term Impact
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground tracking-wider mb-3">
            HOW THE CRISIS CHANGED THE WORLD
          </h1>
          <p className="font-typewriter text-sm text-muted-foreground max-w-lg mx-auto">
            The 13 days in October 1962 reshaped diplomacy, nuclear policy, and international relations for generations.
          </p>
        </div>

        {/* Legacy items */}
        <div className="space-y-4 mb-8">
          {HISTORICAL_COMPARISON.legacy.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="border border-border bg-card rounded-sm p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-display text-sm font-bold text-secondary">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground tracking-wide mb-1">
                    {item.title}
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="border border-secondary/30 bg-secondary/5 rounded-sm p-6 text-center mb-8"
        >
          <p className="font-typewriter text-sm text-foreground/70 leading-relaxed">
            The Cuban Missile Crisis taught the world that nuclear weapons are not tools of strategy — 
            they are instruments of annihilation. The courage to choose restraint, even under unbearable 
            pressure, may be the most important lesson of the 20th century.
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-4">
            The missiles of October still echo in every nuclear negotiation today.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <Button onClick={onRestart} className="bg-secondary text-secondary-foreground font-display tracking-wider">
            <RotateCcw className="w-4 h-4 mr-2" /> Start a New Timeline
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
