"use client";

import { formatDuration } from "@/utils/time";

import { FullscreenClockCard } from "./fullscreen-clock-card";

type MinimalClockProps = {
  seconds: number;
  isRunning?: boolean;
};

export const MinimalClock = ({
  seconds,
  isRunning = false,
}: MinimalClockProps) => (
  <FullscreenClockCard
    baseClassName="rounded-2xl border-2 border-slate-200 bg-white p-8 text-center shadow-sm"
    fullscreenClassName="flex min-h-screen w-full flex-col items-center justify-center gap-6 border bg-white p-10 text-center shadow-none"
    titleClassName="mb-4 text-xs font-medium uppercase tracking-widest text-slate-400"
    fullscreenTitleClassName="mb-4 text-sm font-semibold uppercase tracking-[0.45em] text-slate-500"
    buttonClassName="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-800 backdrop-blur-sm transition hover:border-slate-300"
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

