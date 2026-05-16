import React, { useState, useEffect } from "react";
import { Timer } from "lucide-react";

export default function CountdownTimer({ seconds, onExpire, paused }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (paused || remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [paused, remaining, onExpire]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isUrgent = remaining <= 30;

  return (
    <div className={`flex items-center gap-2 font-mono text-sm ${isUrgent ? "text-red-400 animate-pulse-red" : "text-secondary"}`}>
      <Timer className="w-3.5 h-3.5" />
      <span className="tracking-widest">
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
      {isUrgent && (
        <span className="text-[9px] tracking-widest uppercase">Time Running Out</span>
      )}
    </div>
  );
}
