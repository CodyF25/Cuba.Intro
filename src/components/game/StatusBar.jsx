import React from "react";
import { Globe, Shield, Users, Lock } from "lucide-react";

function StatItem({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`w-3 h-3 ${color}`} />
      <div>
        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">{label}</div>
        <div className="h-1.5 w-16 bg-muted rounded-sm overflow-hidden mt-0.5">
          <div
            className={`h-full transition-all duration-700 ${
              value >= 60 ? "bg-green-500" : value >= 35 ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function StatusBar({ worldOpinion, militaryPressure, sovietTrust, date }) {
  return (
    <div className="border border-border bg-card rounded-sm p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Situation Room Status
        </span>
        <span className="font-mono text-xs text-secondary">{date}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatItem icon={Globe} label="World Opinion" value={worldOpinion} color="text-blue-400" />
        <StatItem icon={Shield} label="Mil. Confidence" value={100 - militaryPressure} color="text-orange-400" />
        <StatItem icon={Lock} label="Soviet Trust" value={sovietTrust} color="text-purple-400" />
      </div>
    </div>
  );
}
