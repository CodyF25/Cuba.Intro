import React from "react";
import { motion } from "framer-motion";
import { DEFCON_LEVELS } from "@/lib/gameData";
import { AlertTriangle, Radiation } from "lucide-react";

function getDefconLevel(tension) {
  if (tension >= 90) return 1;
  if (tension >= 70) return 2;
  if (tension >= 50) return 3;
  if (tension >= 25) return 4;
  return 5;
}

export default function TensionMeter({ tension }) {
  const defcon = getDefconLevel(tension);
  const defconData = DEFCON_LEVELS.find(d => d.level === defcon);
  const isHighAlert = defcon <= 2;
  const isCritical = defcon === 1;

  return (
    <div className="relative">
      {/* DEFCON display */}
      <div className={`border border-border rounded-sm p-3 bg-card ${isCritical ? "animate-pulse-red" : ""}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isHighAlert ? (
              <Radiation className="w-4 h-4 text-red-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-secondary" />
            )}
            <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
              Defense Condition
            </span>
          </div>
          <span className={`font-display text-2xl font-bold ${defconData.textColor}`}>
            {defcon}
          </span>
        </div>

        <div className={`font-display text-sm font-semibold tracking-wider ${defconData.textColor} mb-1`}>
          {defconData.label}
        </div>
        <div className="text-[10px] font-mono text-muted-foreground">
          {defconData.description}
        </div>

        {/* Tension bar */}
        <div className="mt-3 h-2 bg-muted rounded-sm overflow-hidden">
          <motion.div
            className={`h-full ${
              tension >= 80 ? "bg-red-600" :
              tension >= 60 ? "bg-orange-500" :
              tension >= 40 ? "bg-yellow-500" :
              "bg-green-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(tension, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] font-mono text-green-500">PEACE</span>
          <span className="font-mono text-[10px] text-muted-foreground">{tension}%</span>
          <span className="text-[9px] font-mono text-red-500">WAR</span>
        </div>
      </div>

      {/* Warning indicators */}
      {isHighAlert && (
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse-red" />
      )}
    </div>
  );
}
