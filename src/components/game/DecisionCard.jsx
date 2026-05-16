import React from "react";
import { motion } from "framer-motion";
import { Crosshair, Anchor, Phone, Swords, Tv, Handshake, AlertTriangle, ShieldAlert, Filter, ArrowDownToLine, Bomb, Globe, PenLine, Radio, Eye, Flame, MessageSquare, Scale, Radiation, Skull, ListChecks, SearchCheck, HelpCircle, Bird } from "lucide-react";

const iconMap = {
  Crosshair, Anchor, Phone, Swords, Tv, Handshake, AlertTriangle,
  ShieldAlert, Filter, ArrowDownToLine, Bomb, Globe, PenLine, Radio, Eye,
  Flame, MessageSquare, Scale, Radiation, Skull, ListChecks, SearchCheck, HelpCircle, Bird,
};

export default function DecisionCard({ option, index, onSelect, disabled }) {
  const IconComponent = iconMap[option.icon] || HelpCircle;
  
  const riskLevel = option.tensionChange > 25 ? "EXTREME" :
    option.tensionChange > 10 ? "HIGH" :
    option.tensionChange > 0 ? "MODERATE" :
    option.tensionChange > -10 ? "LOW" : "DIPLOMATIC";
  
  const riskColor = option.tensionChange > 25 ? "text-red-400 border-red-800/50" :
    option.tensionChange > 10 ? "text-orange-400 border-orange-800/50" :
    option.tensionChange > 0 ? "text-yellow-400 border-yellow-800/50" :
    option.tensionChange > -10 ? "text-green-400 border-green-800/50" :
    "text-blue-400 border-blue-800/50";

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(option)}
      disabled={disabled}
      className="w-full text-left border border-border hover:border-primary/50 bg-card hover:bg-muted/50 rounded-sm p-4 transition-colors group disabled:opacity-50"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-muted rounded-sm border border-border group-hover:border-primary/30 transition-colors shrink-0">
          <IconComponent className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-display text-sm font-semibold text-foreground tracking-wide">
              {option.label}
            </h4>
            <span className={`text-[9px] font-mono tracking-widest border rounded-sm px-1.5 py-0.5 shrink-0 ${riskColor}`}>
              {riskLevel} RISK
            </span>
          </div>
          <p className="text-xs font-mono text-muted-foreground leading-relaxed">
            {option.description}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
