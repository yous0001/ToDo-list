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
}: MinimalClockProps) => (
  <FullscreenClockCard
    background={background}
    footer={({ isFullscreen }) =>
      isRunning ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500"></div>
          <p
            className={`font-medium text-slate-500 ${
              isFullscreen ? "text-sm tracking-[0.35em]" : "text-xs"
            }`}
          >
            Running
          </p>
        </div>
      ) : null
    }
  >
    {({ isFullscreen }) => (
      <div
        className={`font-mono font-light text-slate-900 ${
          isFullscreen ? "text-[clamp(4rem,10vw,12rem)]" : "text-7xl"
        }`}
      >
        {formatDuration(seconds)}
      </div>
    )}
  </FullscreenClockCard>
);

