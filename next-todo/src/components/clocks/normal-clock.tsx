"use client";

import { formatDuration } from "@/utils/time";

type NormalClockProps = {
  seconds: number;
  isRunning?: boolean;
};

export const NormalClock = ({
  seconds,
  isRunning = false,
}: NormalClockProps) => {
  return (
    <div className="rounded-2xl border-4 border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 text-center shadow-lg">
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
        Time Elapsed
      </p>
      <div className="mt-4 text-6xl font-bold text-indigo-900 font-mono">
        {formatDuration(seconds)}
      </div>
      {isRunning && (
        <p className="mt-2 text-sm font-semibold text-amber-600 animate-pulse">
          ⏱️ Timer Running
        </p>
      )}
    </div>
  );
};
