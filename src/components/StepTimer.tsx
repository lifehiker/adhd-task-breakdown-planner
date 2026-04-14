"use client";
import { useState, useEffect } from "react";

interface StepTimerProps {
  running: boolean;
  onTick?: (seconds: number) => void;
}

export function StepTimer({ running, onTick }: StepTimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (running) {
      interval = setInterval(() => {
        setSeconds((s) => {
          const next = s + 1;
          onTick?.(next);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running, onTick]);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return (
    <div className="text-3xl font-mono font-bold text-[#7c3aed] tabular-nums">
      {m.toString().padStart(2, "0")}:{s.toString().padStart(2, "0")}
    </div>
  );
}
