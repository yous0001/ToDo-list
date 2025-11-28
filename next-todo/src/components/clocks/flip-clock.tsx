"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "@pqina/flip/dist/flip.min.css";
import type { TickInstance } from "@pqina/flip";

type FlipClockProps = {
  seconds: number;
  isRunning?: boolean;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
};

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
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

export const FlipClock = ({ seconds, isRunning = false }: FlipClockProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const flipInstanceRef = useRef<TickInstance | null>(null);
  const tickModuleRef = useRef<TickModule | null>(null);
  const initialValueRef = useRef<string>(formatTimeParts(seconds));
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  useEffect(() => {
    const updateState = () => {
      const element = wrapperRef.current;
      const fsDoc = document as FullscreenDocument;
      const fullscreenElement =
        fsDoc.fullscreenElement ??
        fsDoc.webkitFullscreenElement ??
        fsDoc.mozFullScreenElement ??
        fsDoc.msFullscreenElement;
      setIsFullscreen(Boolean(element && fullscreenElement === element));
    };

    document.addEventListener("fullscreenchange", updateState);
    document.addEventListener("webkitfullscreenchange", updateState);
    document.addEventListener("mozfullscreenchange", updateState);
    document.addEventListener("MSFullscreenChange", updateState);
    return () => {
      document.removeEventListener("fullscreenchange", updateState);
      document.removeEventListener("webkitfullscreenchange", updateState);
      document.removeEventListener("mozfullscreenchange", updateState);
      document.removeEventListener("MSFullscreenChange", updateState);
    };
  }, []);

  const handleFullscreenToggle = () => {
    const element = wrapperRef.current;
    if (!element) {
      return;
    }
    if (isFullscreen) {
      const exitFullscreen =
        document.exitFullscreen ||
        (document as FullscreenDocument).webkitExitFullscreen ||
        (document as FullscreenDocument).mozCancelFullScreen ||
        (document as FullscreenDocument).msExitFullscreen;
      if (typeof exitFullscreen === "function") {
        exitFullscreen.call(document);
      }
      return;
    }
    const target = element as FullscreenElement;
    const requestFullscreen =
      element.requestFullscreen ||
      target.webkitRequestFullscreen ||
      target.mozRequestFullScreen ||
      target.msRequestFullscreen;
    if (typeof requestFullscreen === "function") {
      requestFullscreen.call(element);
    }
  };

  const wrapperClasses = [
    "relative bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 border-slate-300/50",
    isFullscreen
      ? "flex min-h-screen w-full flex-col items-center justify-center gap-6 border p-8 text-center shadow-none"
      : "rounded-2xl border-2 p-6 shadow-xl",
  ].join(" ");

  const clockStyle = useMemo(() => {
    const fullscreenFontSize = "clamp(3rem, min(8vw, 14vh), 11rem)";
    return {
      fontSize: isFullscreen
        ? fullscreenFontSize
        : "clamp(2.75rem, 5vw, 4.75rem)",
      letterSpacing: isFullscreen ? "0.18em" : "0.08em",
      maxWidth: isFullscreen ? "min(92vw, 1600px)" : undefined,
    };
  }, [isFullscreen]);

  const titleClasses = [
    "text-center font-bold uppercase text-slate-300",
    isFullscreen
      ? "text-sm md:text-base tracking-[0.45em]"
      : "text-xs tracking-[0.3em]",
  ].join(" ");

  const runningTextClasses = [
    "font-semibold uppercase text-emerald-300",
    isFullscreen ? "text-sm tracking-[0.35em]" : "text-xs tracking-[0.25em]",
  ].join(" ");

  return (
    <div ref={wrapperRef} className={wrapperClasses}>
      <button
        type="button"
        onClick={handleFullscreenToggle}
        className="absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-xs font-semibold text-white/80 backdrop-blur-sm transition hover:border-white/60 hover:bg-black/50"
        aria-label={
          isFullscreen ? "Exit fullscreen" : "View flip clock in fullscreen"
        }
      >
        {isFullscreen ? "✕" : "⛶"}
      </button>
      <p className={`mb-4 ${titleClasses}`}>Time Elapsed</p>
      <div className="flex w-full items-center justify-center px-4 overflow-hidden">
        <div
          ref={containerRef}
          className="tick flip-clock text-white uppercase"
          data-value={timeValue}
          aria-label={timeValue}
          data-credits="false"
          style={clockStyle}
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
      {isRunning && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className={runningTextClasses}>Timer running</span>
        </div>
      )}
    </div>
  );
};
