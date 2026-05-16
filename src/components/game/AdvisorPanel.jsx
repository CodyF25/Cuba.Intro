import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Shield, Swords, Handshake } from "lucide-react";

const stanceConfig = {
  aggressive: { icon: Swords, color: "text-red-400", border: "border-red-800/50", bg: "bg-red-950/30", label: "HAWKISH" },
  moderate: { icon: Shield, color: "text-yellow-400", border: "border-yellow-800/50", bg: "bg-yellow-950/30", label: "MODERATE" },
  diplomatic: { icon: Handshake, color: "text-green-400", border: "border-green-800/50", bg: "bg-green-950/30", label: "DOVISH" },
};

export default function AdvisorPanel({ advisors }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-2">
      <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">
        Advisor Briefings
      </h3>
      {advisors.map((advisor, i) => {
        const config = stanceConfig[advisor.stance];
        const Icon = config.icon;
        const isOpen = expanded === i;

        return (
          <motion.div
            key={advisor.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`border ${config.border} ${config.bg} rounded-sm cursor-pointer`}
            onClick={() => setExpanded(isOpen ? null : i)}
          >
            <div className="flex items-center justify-between p-2.5">
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                <div>
                  <span className="font-mono text-xs text-foreground">{advisor.name}</span>
                  <span className={`ml-2 text-[9px] font-display tracking-widest ${config.color}`}>
                    {config.label}
                  </span>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="w-3 h-3 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              )}
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-2.5 pb-2.5 border-t border-border/30 pt-2">
                    <p className="text-[10px] text-muted-foreground font-mono leading-relaxed mb-1">
                      {advisor.role}
                    </p>
                    <p className="text-xs font-typewriter text-foreground/80 leading-relaxed italic">
                      "{advisor.opinion}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
