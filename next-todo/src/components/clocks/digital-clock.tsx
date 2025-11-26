"use client";

import { useMemo } from "react";

type DigitalClockProps = {
  seconds: number;
  isRunning?: boolean;
};

export const DigitalClock = ({
  seconds,
  isRunning = false,
}: DigitalClockProps) => {
  const { hours, minutes, secs } = useMemo(() => {
    const totalSeconds = Math.floor(seconds); // Ensure integer
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    return {
      hours: h.toString().padStart(2, "0"),
      minutes: m.toString().padStart(2, "0"),
      secs: s.toString().padStart(2, "0"),
    };
  }, [seconds]);

  return (
    <div className="rounded-2xl border-4 border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center shadow-2xl">
      <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Time Elapsed
      </p>
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-slate-950 px-6 py-4 shadow-inner">
            <span className="text-7xl font-bold text-emerald-400 font-mono tabular-nums">
              {hours}
            </span>
          </div>
          <span className="mt-2 text-xs font-medium text-slate-400 uppercase">
            Hours
          </span>
        </div>
        <div className="text-6xl font-bold text-slate-600">:</div>
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-slate-950 px-6 py-4 shadow-inner">
            <span className="text-7xl font-bold text-blue-400 font-mono tabular-nums">
              {minutes}
            </span>
          </div>
          <span className="mt-2 text-xs font-medium text-slate-400 uppercase">
            Minutes
          </span>
        </div>
        <div className="text-6xl font-bold text-slate-600">:</div>
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-slate-950 px-6 py-4 shadow-inner">
            <span className="text-7xl font-bold text-purple-400 font-mono tabular-nums">
              {secs}
            </span>
          </div>
          <span className="mt-2 text-xs font-medium text-slate-400 uppercase">
            Seconds
          </span>
        </div>
      </div>
      {isRunning && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
          <p className="text-sm font-semibold text-emerald-400">
            Timer Running
          </p>
        </div>
      )}
    </div>
  );
};
