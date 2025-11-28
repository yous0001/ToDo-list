"use client";

import { formatDuration } from "@/utils/time";

import { FullscreenClockCard } from "./fullscreen-clock-card";
import type { BackgroundTheme } from "./clock-backgrounds";

type NormalClockProps = {
  seconds: number;
  isRunning?: boolean;
  background?: BackgroundTheme;
};

export const NormalClock = ({
  seconds,
  isRunning = false,
  background,
}: NormalClockProps) => (
  <FullscreenClockCard
    background={background}
    footer={({ isFullscreen }) =>
      isRunning ? (
        <p
          className={`mt-4 font-semibold text-amber-600 ${
            isFullscreen
              ? "text-base tracking-[0.4em]"
              : "text-sm animate-pulse tracking-[0.25em]"
          }`}
        >
          ⏱️ Timer Running
        </p>
      ) : null
    }
  >
    {({ isFullscreen }) => (
      <div
        className={`mt-4 font-mono font-bold text-indigo-900 ${
          isFullscreen ? "text-[clamp(4rem,10vw,12rem)]" : "text-6xl"
        }`}
      >
        {formatDuration(seconds)}
      </div>
    )}
  </FullscreenClockCard>
);

