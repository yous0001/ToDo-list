"use client";

import { formatDuration } from "@/utils/time";

import { FullscreenClockCard } from "./fullscreen-clock-card";
import type { BackgroundTheme } from "./clock-backgrounds";

type MinimalClockProps = {
  seconds: number;
  isRunning?: boolean;
  background?: BackgroundTheme;
};

export const MinimalClock = ({
  seconds,
  isRunning = false,
  background,
}: MinimalClockProps) => {
  const isDarkBackground = background
    ? [
        "slate-dark",
        "indigo-gradient",
        "purple-gradient",
        "emerald-gradient",
        "rose-gradient",
        "amber-gradient",
        "cyan-gradient",
        "violet-gradient",
        "ocean",
        "sunset",
        "forest",
        "cosmic",
        "neon",
        "minimal-dark",
        "glass",
      ].includes(background.id as string)
    : false;

  return (
    <FullscreenClockCard
      background={background}
      footer={({ isFullscreen }) =>
        isRunning ? (
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            <p
              className={`font-medium ${
                isDarkBackground ? "text-slate-200" : "text-slate-500"
              } ${
                isFullscreen ? "text-sm tracking-[0.3em]" : "text-xs tracking-[0.15em]"
              }`}
            >
              Running
            </p>
          </div>
        ) : null
      }
    >
      {({ isFullscreen }) => (
        <div className="flex items-center justify-center py-6">
          <div
            className={`font-mono font-light ${
              isDarkBackground ? "text-slate-50 drop-shadow" : "text-slate-900"
            } ${
              isFullscreen
                ? "text-[clamp(3.5rem,8vw,7rem)] tracking-tight"
                : "text-6xl tracking-tight"
            }`}
          >
            {formatDuration(seconds)}
          </div>
        </div>
      )}
    </FullscreenClockCard>
  );
};

