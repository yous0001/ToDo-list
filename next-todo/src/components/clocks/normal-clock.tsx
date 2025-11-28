"use client";

import { formatDuration } from "@/utils/time";

import { FullscreenClockCard } from "./fullscreen-clock-card";

type NormalClockProps = {
  seconds: number;
  isRunning?: boolean;
};

export const NormalClock = ({
  seconds,
  isRunning = false,
}: NormalClockProps) => (
  <FullscreenClockCard
    baseClassName="rounded-2xl border-4 border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 text-center shadow-lg"
    fullscreenClassName="flex min-h-screen w-full flex-col items-center justify-center gap-6 border bg-gradient-to-br from-indigo-100 to-purple-200 p-10 text-center shadow-none"
    titleClassName="text-sm font-semibold uppercase tracking-wider text-indigo-600"
    fullscreenTitleClassName="text-base font-semibold uppercase tracking-[0.5em] text-indigo-700"
    buttonClassName="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-indigo-200 bg-white/70 text-indigo-900 backdrop-blur-sm transition hover:border-indigo-400 hover:bg-white"
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

