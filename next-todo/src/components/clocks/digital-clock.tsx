"use client";

import { useMemo } from "react";

import { FullscreenClockCard } from "./fullscreen-clock-card";
import type { BackgroundTheme } from "./clock-backgrounds";

type DigitalClockProps = {
  seconds: number;
  isRunning?: boolean;
  background?: BackgroundTheme;
};

export const DigitalClock = ({
  seconds,
  isRunning = false,
  background,
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
    <FullscreenClockCard
      background={background}
      footer={({ isFullscreen }) =>
        isRunning ? (
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
            <p
              className={`font-semibold text-emerald-400 ${
                isFullscreen ? "text-base tracking-[0.4em]" : "text-sm"
              }`}
            >
              Timer Running
            </p>
          </div>
        ) : null
      }
    >
      {({ isFullscreen }) => {
        const digitContainerClass = isFullscreen
          ? "rounded-lg bg-slate-950 px-10 py-6 shadow-inner"
          : "rounded-lg bg-slate-950 px-6 py-4 shadow-inner";
        const digitClass = isFullscreen
          ? "text-[clamp(4rem,8vw,10rem)]"
          : "text-7xl";
        const colonClass = `font-bold text-slate-600 ${
          isFullscreen ? "text-[clamp(4rem,8vw,10rem)]" : "text-6xl"
        }`;

        const renderSegment = (
          label: string,
          value: string,
          color: string
        ) => (
          <div className="flex flex-col items-center">
            <div className={digitContainerClass}>
              <span
                className={`${digitClass} font-bold font-mono tabular-nums ${color}`}
              >
                {value}
              </span>
            </div>
            <span
              className={`mt-2 uppercase text-slate-400 ${
                isFullscreen ? "text-sm tracking-[0.4em]" : "text-xs"
              }`}
            >
              {label}
            </span>
          </div>
        );

        return (
          <div
            className={`flex items-center justify-center ${
              isFullscreen ? "gap-6" : "gap-3"
            }`}
          >
            {renderSegment("Hours", hours, "text-emerald-400")}
            <div className={colonClass}>:</div>
            {renderSegment("Minutes", minutes, "text-blue-400")}
            <div className={colonClass}>:</div>
            {renderSegment("Seconds", secs, "text-purple-400")}
          </div>
        );
      }}
    </FullscreenClockCard>
  );
};

