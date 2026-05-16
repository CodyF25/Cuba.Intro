import React from "react";

export default function RadarWidget() {
  return (
    <div className="relative w-full aspect-square max-w-[120px] mx-auto">
      {/* Radar circle */}
      <div className="absolute inset-0 rounded-full border border-green-800/40 bg-green-950/10">
        {/* Grid lines */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-green-800/20" />
        </div>
        <div className="absolute inset-0 flex justify-center">
          <div className="h-full w-px bg-green-800/20" />
        </div>
        
        {/* Inner circles */}
        <div className="absolute inset-[25%] rounded-full border border-green-800/15" />
        <div className="absolute inset-[50%] rounded-full border border-green-800/15" />
        
        {/* Sweep */}
        <div className="absolute inset-0 animate-radar origin-center">
          <div
            className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left"
            style={{
              background: "linear-gradient(90deg, hsl(142, 60%, 40%) 0%, transparent 100%)"
            }}
          />
        </div>
        
        {/* Blips */}
        <div className="absolute top-[30%] left-[60%] w-1.5 h-1.5 rounded-full bg-green-500/60 animate-pulse" />
        <div className="absolute top-[55%] left-[35%] w-1 h-1 rounded-full bg-green-400/40 animate-pulse" />
        <div className="absolute top-[70%] left-[65%] w-1.5 h-1.5 rounded-full bg-red-500/50 animate-pulse" />
      </div>
    </div>
  );
}
