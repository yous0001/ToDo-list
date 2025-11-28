"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef } from "react";
import "@pqina/flip/dist/flip.min.css";
import type { TickInstance } from "@pqina/flip";

import { FullscreenClockCard } from "./fullscreen-clock-card";
import type { BackgroundTheme } from "./clock-backgrounds";

type FlipClockProps = {
  seconds: number;
  isRunning?: boolean;
  background?: BackgroundTheme;
};

const formatTimeParts = (seconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  const ss = secs.toString().padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
};

type TickModule = typeof import("@pqina/flip").default;

export const FlipClock = ({
  seconds,
  isRunning = false,
  background,
}: FlipClockProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const flipInstanceRef = useRef<TickInstance | null>(null);
  const tickModuleRef = useRef<TickModule | null>(null);
  const initialValueRef = useRef<string>(formatTimeParts(seconds));

  const timeValue = useMemo(() => formatTimeParts(seconds), [seconds]);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      if (!containerRef.current || flipInstanceRef.current) {
        return;
      }
      if (!tickModuleRef.current) {
        const flipModule = await import("@pqina/flip");
        if (cancelled) {
          return;
        }
        tickModuleRef.current = flipModule.default;
      }

      const Tick = tickModuleRef.current;
      if (!Tick || !containerRef.current) {
        return;
      }
      const instance = Tick.DOM.create(containerRef.current, {
        value: initialValueRef.current,
      });

      if (instance && !cancelled) {
        flipInstanceRef.current = instance;
      }
    };

    void init();

    return () => {
      cancelled = true;
      flipInstanceRef.current?.destroy();
      flipInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = flipInstanceRef.current;
    if (!instance) {
      return;
    }
    instance.value = timeValue;
    instance.root?.setAttribute("aria-label", timeValue);
  }, [timeValue]);

  const getClockStyles = (fullscreen: boolean): CSSProperties => ({
    fontSize: fullscreen
      ? "clamp(3rem, min(8vw, 14vh), 11rem)"
      : "clamp(2.75rem, 5vw, 4.75rem)",
    letterSpacing: fullscreen ? "0.18em" : "0.08em",
    maxWidth: fullscreen ? "min(92vw, 1600px)" : undefined,
  });

  return (
    <FullscreenClockCard
      background={background}
      footer={({ isFullscreen }) =>
        isRunning ? (
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span
              className={`font-semibold uppercase text-emerald-300 ${
                isFullscreen
                  ? "text-sm tracking-[0.35em]"
                  : "text-xs tracking-[0.25em]"
              }`}
            >
              Timer running
            </span>
          </div>
        ) : null
      }
    >
      {({ isFullscreen }) => (
        <div className="flex w-full items-center justify-center overflow-hidden px-4">
          <div
            ref={containerRef}
            className="tick flip-clock text-white uppercase"
            data-value={timeValue}
            aria-label={timeValue}
            data-credits="false"
            style={getClockStyles(isFullscreen)}
          >
            <div
              data-repeat="true"
              data-layout="horizontal fit"
              aria-hidden="true"
            >
              <div data-view="flip" />
            </div>
          </div>
        </div>
      )}
    </FullscreenClockCard>
  );
};
