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
}: NormalClockProps) => {
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
          <p
            className={`mt-4 font-semibold ${
              isDarkBackground ? "text-amber-200" : "text-amber-600"
            } ${
              isFullscreen
                ? "text-sm md:text-base tracking-[0.35em]"
                : "text-xs tracking-[0.25em] animate-pulse"
            }`}
          >
            ⏱️ Timer Running
          </p>
        ) : null
      }
    >
      {({ isFullscreen }) => (
        <div className="flex items-center justify-center py-6">
          <div
            className={`font-mono font-bold tracking-tight ${
              isDarkBackground ? "text-slate-50 drop-shadow" : "text-slate-900"
            } ${isFullscreen ? "text-[clamp(3.5rem,8vw,8rem)]" : "text-5xl"}`}
          >
            {formatDuration(seconds)}
          </div>
        </div>
      )}
    </FullscreenClockCard>
  );
};

