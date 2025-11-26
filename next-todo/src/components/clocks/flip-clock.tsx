"use client";

import { useMemo, useState, useEffect } from "react";

type FlipClockProps = {
  seconds: number;
  isRunning?: boolean;
};

const FlipDigit = ({
  value,
  label,
  previousValue,
}: {
  value: string;
  label: string;
  previousValue?: string;
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (previousValue !== undefined && previousValue !== value) {
      // Start flip animation
      const rafId = requestAnimationFrame(() => {
        setIsFlipping(true);

        // Halfway through animation, update the value
        const timeout = setTimeout(() => {
          setDisplayValue(value);
        }, 350); // Half of 700ms animation

        // After animation completes, reset
        const resetTimeout = setTimeout(() => {
          setIsFlipping(false);
        }, 700);

        return () => {
          clearTimeout(timeout);
          clearTimeout(resetTimeout);
        };
      });

      return () => {
        cancelAnimationFrame(rafId);
      };
    } else {
      requestAnimationFrame(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      });
    }
  }, [value, previousValue]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{
          perspective: "800px",
          perspectiveOrigin: "center center",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Main flip card container */}
        <div className="relative w-16 h-20">
          {/* Outer shadow frame */}
          <div className="absolute -inset-1 bg-slate-900/40 rounded-md blur-sm"></div>

          {/* Card container with gap in middle */}
          <div className="relative w-full h-full">
            {/* ===== TOP HALF ===== */}
            <div className="absolute top-0 left-0 right-0 h-[39px] z-10">
              {/* Static top half background */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-md border border-slate-950 border-b-0 shadow-lg overflow-hidden">
                {/* Current digit - top half only (clipped) */}
                <div className="absolute inset-0 flex items-start justify-center pt-1 overflow-hidden">
                  <span className="text-7xl font-bold text-white font-mono tabular-nums leading-none select-none">
                    {displayValue}
                  </span>
                </div>
                {/* Top shine effect */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
              </div>

              {/* Flipping top half - appears during animation */}
              {isFlipping && (
                <div
                  className="absolute inset-0 origin-bottom rounded-t-md z-20"
                  style={{
                    transformStyle: "preserve-3d",
                    animation:
                      "flipTopDown 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                    willChange: "transform, opacity, filter",
                  }}
                >
                  {/* Front face - old value top half */}
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-md border border-slate-950 border-b-0 shadow-lg overflow-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="absolute inset-0 flex items-start justify-center pt-1 overflow-hidden">
                      <span className="text-7xl font-bold text-white font-mono tabular-nums leading-none select-none">
                        {previousValue}
                      </span>
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Back face - new value bottom half (will be visible when flipped) */}
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 rounded-t-md shadow-lg overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateX(180deg)",
                    }}
                  >
                    <div className="absolute inset-0 flex items-end justify-center pb-1 overflow-hidden">
                      <span className="text-7xl font-bold text-white font-mono tabular-nums leading-none select-none">
                        {value}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              )}
            </div>

            {/* ===== GAP / DIVIDER ===== */}
            <div className="absolute top-[39px] left-0 right-0 h-[2px] bg-slate-950 z-30 shadow-md"></div>

            {/* ===== BOTTOM HALF ===== */}
            <div className="absolute bottom-0 left-0 right-0 h-[39px] z-10">
              {/* Static bottom half background */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 rounded-b-md border border-slate-950 border-t-0 shadow-lg overflow-hidden">
                {/* Current digit - bottom half only (clipped) */}
                <div className="absolute inset-0 flex items-end justify-center pb-1 overflow-hidden">
                  <span className="text-7xl font-bold text-white font-mono tabular-nums leading-none select-none">
                    {displayValue}
                  </span>
                </div>
                {/* Bottom shadow effect */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
              </div>

              {/* Flipping bottom half - appears during animation */}
              {isFlipping && (
                <div
                  className="absolute inset-0 origin-top rounded-b-md z-20"
                  style={{
                    transformStyle: "preserve-3d",
                    animation:
                      "flipBottomUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                    willChange: "transform, opacity, filter",
                  }}
                >
                  {/* Front face - old value bottom half */}
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 rounded-b-md border border-slate-950 border-t-0 shadow-lg overflow-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="absolute inset-0 flex items-end justify-center pb-1 overflow-hidden">
                      <span className="text-7xl font-bold text-white font-mono tabular-nums leading-none select-none">
                        {previousValue}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Back face - new value top half (will be visible when flipped) */}
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 rounded-b-md shadow-lg overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateX(-180deg)",
                    }}
                  >
                    <div className="absolute inset-0 flex items-start justify-center pt-1 overflow-hidden">
                      <span className="text-7xl font-bold text-white font-mono tabular-nums leading-none select-none">
                        {value}
                      </span>
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
};

export const FlipClock = ({ seconds, isRunning = false }: FlipClockProps) => {
  // Track previous values for each digit pair independently
  const [prevHours, setPrevHours] = useState<string | null>(null);
  const [prevMinutes, setPrevMinutes] = useState<string | null>(null);
  const [prevSecs, setPrevSecs] = useState<string | null>(null);

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

  // Track previous values independently for each digit pair
  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevHours(hours);
      setPrevMinutes(minutes);
      setPrevSecs(secs);
    }, 0);
    return () => clearTimeout(timer);
  }, [hours, minutes, secs]);

  return (
    <div className="rounded-2xl border-2 border-slate-300/50 bg-gradient-to-br from-slate-100 to-slate-200 p-8 shadow-xl">
      <p className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-slate-600">
        Time Elapsed
      </p>
      <div className="flex items-center justify-center gap-4">
        {/* Hours - two digits */}
        <div className="flex gap-1">
          <FlipDigit
            value={hours[0]}
            label=""
            previousValue={
              prevHours && prevHours[0] !== hours[0] ? prevHours[0] : undefined
            }
          />
          <FlipDigit
            value={hours[1]}
            label=""
            previousValue={
              prevHours && prevHours[1] !== hours[1] ? prevHours[1] : undefined
            }
          />
        </div>
        <div className="text-4xl font-bold text-slate-700 mb-1">:</div>
        {/* Minutes - two digits */}
        <div className="flex gap-1">
          <FlipDigit
            value={minutes[0]}
            label=""
            previousValue={
              prevMinutes && prevMinutes[0] !== minutes[0]
                ? prevMinutes[0]
                : undefined
            }
          />
          <FlipDigit
            value={minutes[1]}
            label=""
            previousValue={
              prevMinutes && prevMinutes[1] !== minutes[1]
                ? prevMinutes[1]
                : undefined
            }
          />
        </div>
        <div className="text-4xl font-bold text-slate-700 mb-1">:</div>
        {/* Seconds - two digits */}
        <div className="flex gap-1">
          <FlipDigit
            value={secs[0]}
            label=""
            previousValue={
              prevSecs && prevSecs[0] !== secs[0] ? prevSecs[0] : undefined
            }
          />
          <FlipDigit
            value={secs[1]}
            label=""
            previousValue={
              prevSecs && prevSecs[1] !== secs[1] ? prevSecs[1] : undefined
            }
          />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-12 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        <span>Hours</span>
        <span>Minutes</span>
        <span>Seconds</span>
      </div>
      {isRunning && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="relative">
            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500"></div>
            <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-amber-400 opacity-75"></div>
          </div>
          <p className="text-xs font-bold text-amber-600 animate-pulse">
            ⏱️ Timer Running
          </p>
        </div>
      )}
    </div>
  );
};
