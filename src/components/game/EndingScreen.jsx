import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ENDINGS } from "@/lib/gameData";
import { ArrowRight, RotateCcw, Trophy, AlertTriangle, Shield, Skull } from "lucide-react";
// Note: ArrowRight kept for legacy button

const typeConfig = {
  peace: { icon: Trophy, color: "text-green-400", border: "border-green-800/50", bg: "bg-green-950/20" },
  nuclear: { icon: Skull, color: "text-red-400", border: "border-red-800/50", bg: "bg-red-950/20" },
  humiliation: { icon: AlertTriangle, color: "text-yellow-400", border: "border-yellow-800/50", bg: "bg-yellow-950/20" },
  aggressive_peace: { icon: Shield, color: "text-orange-400", border: "border-orange-800/50", bg: "bg-orange-950/20" },
};

export default function EndingScreen({ endingType, choices, onViewLegacy, onRestart }) {
  const ending = ENDINGS[endingType];
  const config = typeConfig[endingType] || typeConfig.peace;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 bg-background/98 flex items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Icon className={`w-16 h-16 mx-auto mb-4 ${config.color}`} />
          <h1 className={`font-display text-2xl md:text-4xl font-bold ${config.color} tracking-wider mb-4`}>
            {ending.title}
          </h1>
          <p className="font-typewriter text-sm md:text-base text-foreground/70 mb-8 max-w-lg mx-auto">
            {ending.description}
          </p>
        </motion.div>

        {/* Choices summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`border ${config.border} ${config.bg} rounded-sm p-4 mb-6 text-left`}
        >
          <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase mb-3">
            Your Decisions
          </h3>
          <div className="space-y-2">
            {choices.map((choice, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-mono text-[10px] text-muted-foreground shrink-0 mt-0.5">
                  R{i + 1}
                </span>
                <span className="font-mono text-xs text-foreground/80">
                  {choice.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button onClick={onRestart} variant="outline" className="border-border text-foreground hover:bg-muted">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
          <Button onClick={onViewLegacy} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-display tracking-wider">
            The Long-Term Legacy <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
