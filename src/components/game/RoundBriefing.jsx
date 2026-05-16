import React from "react";
import { motion } from "framer-motion";
import { FileText, Clock } from "lucide-react";

export default function RoundBriefing({ round }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      {/* Classification header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-primary/30" />
        <span className="font-display text-[10px] tracking-[0.3em] text-primary uppercase">
          Top Secret — Eyes Only
        </span>
        <div className="h-px flex-1 bg-primary/30" />
      </div>

      {/* Round title */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5 text-secondary">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono text-xs">{round.date}</span>
        </div>
        <span className="text-muted-foreground">—</span>
        <span className="font-display text-lg font-bold tracking-wider text-foreground">
          {round.title}
        </span>
      </div>

      {/* Briefing text */}
      <div className="border border-border bg-card rounded-sm p-4 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            Intelligence Briefing
          </span>
        </div>
        <p className="font-typewriter text-sm text-foreground/85 leading-relaxed">
          {round.briefing}
        </p>
      </div>

      {/* Historical context */}
      <div className="border border-secondary/20 bg-secondary/5 rounded-sm p-3">
        <span className="font-display text-[9px] tracking-[0.2em] text-secondary/80 uppercase">
          Background Intel
        </span>
        <p className="text-[11px] font-mono text-muted-foreground leading-relaxed mt-1">
          {round.historicalContext}
        </p>
      </div>
    </motion.div>
  );
}
