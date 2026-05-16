import React from "react";

export default function NewsTicker({ headline }) {
  return (
    <div className="bg-red-900/30 border-y border-red-800/50 overflow-hidden py-1">
      <div className="flex items-center">
        <span className="bg-red-700 text-white font-display text-[10px] tracking-widest px-3 py-0.5 shrink-0 uppercase">
          Breaking
        </span>
        <div className="overflow-hidden whitespace-nowrap ml-3">
          <span className="inline-block animate-ticker font-mono text-xs text-red-300 tracking-wide">
            ★ {headline} ★ STAY TUNED FOR FURTHER DEVELOPMENTS ★ {headline} ★
          </span>
        </div>
      </div>
    </div>
  );
}
