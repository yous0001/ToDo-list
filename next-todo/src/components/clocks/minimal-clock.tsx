"use client";

import { formatDuration } from "@/utils/time";

type MinimalClockProps = {
  seconds: number;
  isRunning?: boolean;
};

export const MinimalClock = ({
  seconds,
  isRunning = false,
}: MinimalClockProps) => {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 text-center shadow-sm">
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-slate-400">
        Time Elapsed
      </p>
      <div className="text-7xl font-light text-slate-900 font-mono tracking-tight">
        {formatDuration(seconds)}
      </div>
      {isRunning && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500"></div>
          <p className="text-xs font-medium text-slate-500">Running</p>
        </div>
      )}
    </div>
  );
};
