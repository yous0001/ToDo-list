"use client";

import { useMemo } from "react";

import { FullscreenClockCard } from "./fullscreen-clock-card";
import type { BackgroundTheme } from "./clock-backgrounds";

type AnalogClockProps = {
  seconds: number;
  isRunning?: boolean;
  background?: BackgroundTheme;
};

export const AnalogClock = ({
  seconds,
  isRunning = false,
  background,
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
  const hourAngle = ((totalMinutes / 60) % 12) * 30 - 90;
  const minuteAngle = (minuteValue % 60) * 6 - 90;
  const secondAngle = (secondValue % 60) * 6 - 90;

  return (
    <FullscreenClockCard
      background={background}
      footer={({ isFullscreen }) =>
        isRunning ? (
          <p
            className={`mt-4 font-semibold text-amber-600 ${
              isFullscreen ? "text-base tracking-[0.4em]" : "text-sm animate-pulse"
            }`}
          >
            ⏱️ Timer Running
          </p>
        ) : null
      }
    >
      {({ isFullscreen }) => {
        const clockSize = isFullscreen ? 420 : 280;
        const center = clockSize / 2;
        const radius = clockSize / 2 - 20;
        return (
          <div className="flex flex-col items-center">
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
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-slate-200"
                />
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
                <line
                  x1={center}
                  y1={center}
                  x2={
                    center + radius * 0.5 * Math.cos((hourAngle * Math.PI) / 180)
                  }
                  y2={
                    center + radius * 0.5 * Math.sin((hourAngle * Math.PI) / 180)
                  }
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="text-indigo-700"
                />
                <line
                  x1={center}
                  y1={center}
                  x2={
                    center +
                    radius * 0.7 * Math.cos((minuteAngle * Math.PI) / 180)
                  }
                  y2={
                    center +
                    radius * 0.7 * Math.sin((minuteAngle * Math.PI) / 180)
                  }
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="text-indigo-600"
                />
                <line
                  x1={center}
                  y1={center}
                  x2={
                    center +
                    radius * 0.85 * Math.cos((secondAngle * Math.PI) / 180)
                  }
                  y2={
                    center +
                    radius * 0.85 * Math.sin((secondAngle * Math.PI) / 180)
                  }
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-rose-500"
                />
                <circle
                  cx={center}
                  cy={center}
                  r="8"
                  fill="currentColor"
                  className="text-indigo-700"
                />
              </svg>
            </div>
            <div
              className={`mt-6 font-mono font-bold text-indigo-900 ${
                isFullscreen ? "text-4xl md:text-5xl" : "text-3xl"
              }`}
            >
              {hours}:{minutes}:{secs}
            </div>
          </div>
        );
      }}
    </FullscreenClockCard>
  );
};

