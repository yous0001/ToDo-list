"use client";

import { useMemo } from "react";

type AnalogClockProps = {
  seconds: number;
  isRunning?: boolean;
};

export const AnalogClock = ({
  seconds,
  isRunning = false,
}: AnalogClockProps) => {
  const { hours, minutes, secs, totalMinutes, minuteValue, secondValue } =
    useMemo(() => {
      const totalSeconds = Math.floor(seconds); // Ensure integer
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = Math.floor(totalSeconds % 60);
      const totalMins = h * 60 + m;
      return {
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        secs: s.toString().padStart(2, "0"),
        totalMinutes: totalMins,
        minuteValue: m,
        secondValue: s,
      };
    }, [seconds]);

  // Calculate angles for clock hands (12-hour format)
  // Hour hand: moves based on total hours (0-12 hours = 0-360 degrees)
  const hourAngle = ((totalMinutes / 60) % 12) * 30 - 90; // 12 hours = 360 degrees, so 1 hour = 30 degrees
  // Minute hand: moves based on minutes
  const minuteAngle = (minuteValue % 60) * 6 - 90; // 60 minutes = 360 degrees, so 1 minute = 6 degrees
  // Second hand: moves based on seconds
  const secondAngle = (secondValue % 60) * 6 - 90; // 60 seconds = 360 degrees, so 1 second = 6 degrees

  const clockSize = 280;
  const center = clockSize / 2;
  const radius = clockSize / 2 - 20;

  return (
    <div className="rounded-2xl border-4 border-indigo-500 bg-linear-to-br from-indigo-50 to-purple-50 p-8 shadow-lg">
      <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-indigo-600">
        Time Elapsed
      </p>
      <div className="flex flex-col items-center">
        {/* Analog Clock Face */}
        <div
          className="relative"
          style={{ width: clockSize, height: clockSize }}
        >
          <svg
            width={clockSize}
            height={clockSize}
            className="absolute inset-0"
            viewBox={`0 0 ${clockSize} ${clockSize}`}
          >
            {/* Clock face circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="white"
              stroke="currentColor"
              strokeWidth="3"
              className="text-slate-200"
            />
            {/* Hour markers */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const x1 = center + (radius - 15) * Math.cos(angle);
              const y1 = center + (radius - 15) * Math.sin(angle);
              const x2 = center + (radius - 5) * Math.cos(angle);
              const y2 = center + (radius - 5) * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-slate-400"
                />
              );
            })}
            {/* Hour hand */}
            <line
              x1={center}
              y1={center}
              x2={center + radius * 0.5 * Math.cos((hourAngle * Math.PI) / 180)}
              y2={center + radius * 0.5 * Math.sin((hourAngle * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className="text-indigo-700"
            />
            {/* Minute hand */}
            <line
              x1={center}
              y1={center}
              x2={
                center + radius * 0.7 * Math.cos((minuteAngle * Math.PI) / 180)
              }
              y2={
                center + radius * 0.7 * Math.sin((minuteAngle * Math.PI) / 180)
              }
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="text-indigo-600"
            />
            {/* Second hand */}
            <line
              x1={center}
              y1={center}
              x2={
                center + radius * 0.85 * Math.cos((secondAngle * Math.PI) / 180)
              }
              y2={
                center + radius * 0.85 * Math.sin((secondAngle * Math.PI) / 180)
              }
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-rose-500"
            />
            {/* Center dot */}
            <circle
              cx={center}
              cy={center}
              r="8"
              fill="currentColor"
              className="text-indigo-700"
            />
          </svg>
        </div>
        {/* Digital display below */}
        <div className="mt-6 text-3xl font-bold text-indigo-900 font-mono">
          {hours}:{minutes}:{secs}
        </div>
        {isRunning && (
          <p className="mt-2 text-sm font-semibold text-amber-600 animate-pulse">
            ⏱️ Timer Running
          </p>
        )}
      </div>
    </div>
  );
};
