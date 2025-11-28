"use client";

import { useMemo, useState } from "react";

import { FullscreenClockCard } from "./fullscreen-clock-card";
import type { BackgroundTheme } from "./clock-backgrounds";

type AnalogClockProps = {
  seconds: number;
  isRunning?: boolean;
  background?: BackgroundTheme;
};

type AnalogStyleId =
  | "classic"
  | "minimal"
  | "roman"
  | "arabic"
  | "hands-bold"
  | "retro"
  | "outline";

type AnalogStyle = {
  id: AnalogStyleId;
  name: string;
  icon: string;
  faceFill: string;
  faceStroke: string;
  markerColor: string;
  markerThickness: number;
  showMinuteTicks: boolean;
  showNumbers: boolean;
  numbers: string[];
  numberColor: string;
  numberFont: string;
  numberOffset: number;
  hourHandColor: string;
  minuteHandColor: string;
  secondHandColor: string;
  showSecondHand: boolean;
  centerDotColor: string;
};

const BASE_NUMBERS = Array.from({ length: 12 }).map((_v, index) =>
  (index + 1).toString()
);
const ROMAN_NUMBERS = [
  "XII",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
];

const ANALOG_STYLES: AnalogStyle[] = [
  {
    id: "classic",
    name: "Classic",
    icon: "🕰️",
    faceFill: "#ffffff",
    faceStroke: "#cbd5f5",
    markerColor: "#94a3b8",
    markerThickness: 2,
    showMinuteTicks: true,
    showNumbers: true,
    numbers: BASE_NUMBERS,
    numberColor: "#1e293b",
    numberFont: "600 1rem 'Inter', sans-serif",
    numberOffset: 32,
    hourHandColor: "#4338ca",
    minuteHandColor: "#4f46e5",
    secondHandColor: "#f97373",
    showSecondHand: true,
    centerDotColor: "#4338ca",
  },
  {
    id: "minimal",
    name: "Minimal",
    icon: "⚪",
    faceFill: "#0f172a",
    faceStroke: "#64748b",
    markerColor: "#e2e8f0",
    markerThickness: 1.5,
    showMinuteTicks: false,
    showNumbers: false,
    numbers: [],
    numberColor: "#e2e8f0",
    numberFont: "400 0.75rem 'Inter', sans-serif",
    numberOffset: 0,
    hourHandColor: "#e2e8f0",
    minuteHandColor: "#cbd5f5",
    secondHandColor: "#22c55e",
    showSecondHand: false,
    centerDotColor: "#e2e8f0",
  },
  {
    id: "roman",
    name: "Roman",
    icon: "🏛️",
    faceFill: "#fdf8ee",
    faceStroke: "#d4ad76",
    markerColor: "#b7791f",
    markerThickness: 2,
    showMinuteTicks: false,
    showNumbers: true,
    numbers: ROMAN_NUMBERS,
    numberColor: "#7c2d12",
    numberFont: "600 1rem 'Cormorant', serif",
    numberOffset: 30,
    hourHandColor: "#7c2d12",
    minuteHandColor: "#a16207",
    secondHandColor: "#b91c1c",
    showSecondHand: true,
    centerDotColor: "#7c2d12",
  },
  {
    id: "arabic",
    name: "Arabic",
    icon: "١٢",
    faceFill: "#0b1120",
    faceStroke: "#38bdf8",
    markerColor: "#38bdf8",
    markerThickness: 2,
    showMinuteTicks: true,
    showNumbers: true,
    numbers: ["١٢", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠", "١١"],
    numberColor: "#e0f2fe",
    numberFont: "600 1.05rem 'Noto Sans Arabic', system-ui",
    numberOffset: 32,
    hourHandColor: "#e0f2fe",
    minuteHandColor: "#38bdf8",
    secondHandColor: "#f97316",
    showSecondHand: true,
    centerDotColor: "#38bdf8",
  },
  {
    id: "retro",
    name: "Retro",
    icon: "📻",
    faceFill: "#fef3c7",
    faceStroke: "#fb923c",
    markerColor: "#b45309",
    markerThickness: 2,
    showMinuteTicks: true,
    showNumbers: true,
    numbers: BASE_NUMBERS,
    numberColor: "#7c2d12",
    numberFont: "700 1.1rem 'Fredoka', sans-serif",
    numberOffset: 35,
    hourHandColor: "#7c2d12",
    minuteHandColor: "#ea580c",
    secondHandColor: "#b91c1c",
    showSecondHand: true,
    centerDotColor: "#7c2d12",
  },
  {
    id: "hands-bold",
    name: "Bold Hands",
    icon: "🖊️",
    faceFill: "#020617",
    faceStroke: "#94a3b8",
    markerColor: "#64748b",
    markerThickness: 1.5,
    showMinuteTicks: false,
    showNumbers: false,
    numbers: [],
    numberColor: "#e2e8f0",
    numberFont: "400 0.8rem 'Inter', sans-serif",
    numberOffset: 0,
    hourHandColor: "#f97316",
    minuteHandColor: "#22c55e",
    secondHandColor: "#e5e7eb",
    showSecondHand: true,
    centerDotColor: "#e2e8f0",
  },
  {
    id: "outline",
    name: "Outline",
    icon: "⭕",
    faceFill: "transparent",
    faceStroke: "#94a3b8",
    markerColor: "#94a3b8",
    markerThickness: 1.5,
    showMinuteTicks: false,
    showNumbers: false,
    numbers: [],
    numberColor: "#e2e8f0",
    numberFont: "400 0.75rem 'Inter', sans-serif",
    numberOffset: 0,
    hourHandColor: "#e2e8f0",
    minuteHandColor: "#e2e8f0",
    secondHandColor: "#f97373",
    showSecondHand: true,
    centerDotColor: "#e2e8f0",
  },
];

export const AnalogClock = ({
  seconds,
  isRunning = false,
  background,
}: AnalogClockProps) => {
  const [selectedStyle, setSelectedStyle] = useState<AnalogStyleId>("classic");
  const style =
    ANALOG_STYLES.find((entry) => entry.id === selectedStyle) ??
    ANALOG_STYLES[0];

  const { hours, minutes, secs, totalMinutes, minuteValue, secondValue } =
    useMemo(() => {
      const totalSeconds = Math.floor(seconds); // Ensure integer
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = Math.floor(totalSeconds % 60);
      const totalMins = h * 60 + m;
      return {
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        secs: s.toString().padStart(2, "0"),
        totalMinutes: totalMins,
        minuteValue: m,
        secondValue: s,
      };
    }, [seconds]);

  // Calculate angles for clock hands (12-hour format)
  const hourAngle = ((totalMinutes / 60) % 12) * 30 - 90;
  const minuteAngle = (minuteValue % 60) * 6 - 90;
  const secondAngle = (secondValue % 60) * 6 - 90;

  return (
    <FullscreenClockCard
      background={background}
      footer={({ isFullscreen }) =>
        isRunning ? (
          <p
            className={`mt-4 font-semibold text-amber-600 ${
              isFullscreen ? "text-base tracking-[0.4em]" : "text-sm animate-pulse"
            }`}
          >
            ⏱️ Timer Running
          </p>
        ) : null
      }
    >
      {({ isFullscreen }) => {
        const clockSize = isFullscreen ? 420 : 280;
        const center = clockSize / 2;
        const radius = clockSize / 2 - 20;
        const numberRadius = radius - style.numberOffset;
        return (
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative"
              style={{ width: clockSize, height: clockSize }}
            >
              <svg
                width={clockSize}
                height={clockSize}
                className="absolute inset-0"
                viewBox={`0 0 ${clockSize} ${clockSize}`}
              >
                <defs>
                  <radialGradient id={`face-${style.id}`} r="120%">
                    <stop offset="0%" stopColor={style.faceFill} />
                    <stop offset="70%" stopColor={style.faceFill} />
                    <stop offset="100%" stopColor={style.faceStroke} />
                  </radialGradient>
                </defs>
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill={
                    style.faceFill === "transparent"
                      ? "transparent"
                      : `url(#face-${style.id})`
                  }
                  stroke={style.faceStroke}
                  strokeWidth={3}
                />
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180);
                  const x1 = center + (radius - 15) * Math.cos(angle);
                  const y1 = center + (radius - 15) * Math.sin(angle);
                  const x2 = center + (radius - 5) * Math.cos(angle);
                  const y2 = center + (radius - 5) * Math.sin(angle);
                  return (
                    <line
                      key={`h-${i}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={style.markerColor}
                      strokeWidth={style.markerThickness}
                      strokeLinecap="round"
                    />
                  );
                })}
                {style.showMinuteTicks &&
                  Array.from({ length: 60 }).map((_, i) => {
                    if (i % 5 === 0) {
                      return null;
                    }
                    const angle = (i * 6 - 90) * (Math.PI / 180);
                    const x1 = center + (radius - 10) * Math.cos(angle);
                    const y1 = center + (radius - 10) * Math.sin(angle);
                    const x2 = center + (radius - 6) * Math.cos(angle);
                    const y2 = center + (radius - 6) * Math.sin(angle);
                    return (
                      <line
                        key={`m-${i}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={style.markerColor}
                        strokeWidth={1}
                        strokeLinecap="round"
                        opacity={0.7}
                      />
                    );
                  })}
                {style.showNumbers &&
                  style.numbers.map((label, index) => {
                    if (!label) {
                      return null;
                    }
                    const angle = (index * 30 - 90) * (Math.PI / 180);
                    const x = center + numberRadius * Math.cos(angle);
                    const y = center + numberRadius * Math.sin(angle);
                    return (
                      <text
                        key={`n-${label}-${index}`}
                        x={x}
                        y={y + 6}
                        textAnchor="middle"
                        fill={style.numberColor}
                        style={{ font: style.numberFont }}
                      >
                        {label}
                      </text>
                    );
                  })}
                <line
                  x1={center}
                  y1={center}
                  x2={
                    center + radius * 0.5 * Math.cos((hourAngle * Math.PI) / 180)
                  }
                  y2={
                    center + radius * 0.5 * Math.sin((hourAngle * Math.PI) / 180)
                  }
                  stroke={style.hourHandColor}
                  strokeWidth={6}
                  strokeLinecap="round"
                />
                <line
                  x1={center}
                  y1={center}
                  x2={
                    center +
                    radius * 0.7 * Math.cos((minuteAngle * Math.PI) / 180)
                  }
                  y2={
                    center +
                    radius * 0.7 * Math.sin((minuteAngle * Math.PI) / 180)
                  }
                  stroke={style.minuteHandColor}
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                {style.showSecondHand && (
                  <line
                    x1={center}
                    y1={center}
                    x2={
                      center +
                      radius * 0.85 * Math.cos((secondAngle * Math.PI) / 180)
                    }
                    y2={
                      center +
                      radius * 0.85 * Math.sin((secondAngle * Math.PI) / 180)
                    }
                    stroke={style.secondHandColor}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                )}
                <circle
                  cx={center}
                  cy={center}
                  r="8"
                  fill={style.centerDotColor}
                />
              </svg>
            </div>
            <div
              className={`font-mono font-bold text-indigo-900 ${
                isFullscreen ? "text-4xl md:text-5xl" : "text-3xl"
              }`}
            >
              {hours}:{minutes}:{secs}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {ANALOG_STYLES.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedStyle(entry.id)}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    selectedStyle === entry.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white/80 text-slate-700 hover:bg-white"
                  }`}
                  aria-label={`Activate ${entry.name} analog style`}
                >
                  <span>{entry.icon}</span>
                  <span>{entry.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      }}
    </FullscreenClockCard>
  );
};

