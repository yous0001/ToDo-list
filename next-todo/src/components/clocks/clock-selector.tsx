"use client";

import { useState } from "react";
import { NormalClock } from "./normal-clock";
import { FlipClock } from "./flip-clock";
import { AnalogClock } from "./analog-clock";
import { MinimalClock } from "./minimal-clock";
import { DigitalClock } from "./digital-clock";
import {
  CLOCK_BACKGROUNDS,
  getBackgroundTheme,
  type ClockBackground,
} from "./clock-backgrounds";

export type ClockType = "normal" | "flip" | "analog" | "minimal" | "digital";

type ClockSelectorProps = {
  seconds: number;
  isRunning?: boolean;
};

const CLOCK_TYPES: { id: ClockType; label: string; icon: string }[] = [
  { id: "normal", label: "Normal", icon: "🕐" },
  { id: "flip", label: "Flip", icon: "🔄" },
  { id: "analog", label: "Analog", icon: "⏰" },
  { id: "minimal", label: "Minimal", icon: "⚪" },
  { id: "digital", label: "Digital", icon: "💻" },
];

export const ClockSelector = ({
  seconds,
  isRunning = false,
}: ClockSelectorProps) => {
  const [selectedClock, setSelectedClock] = useState<ClockType>("normal");
  const [selectedBackground, setSelectedBackground] =
    useState<ClockBackground>("slate-dark");

  const background = getBackgroundTheme(selectedBackground);

  const renderClock = () => {
    switch (selectedClock) {
      case "normal":
        return (
          <NormalClock
            seconds={seconds}
            isRunning={isRunning}
            background={background}
          />
        );
      case "flip":
        return (
          <FlipClock
            seconds={seconds}
            isRunning={isRunning}
            background={background}
          />
        );
      case "analog":
        return (
          <AnalogClock
            seconds={seconds}
            isRunning={isRunning}
            background={background}
          />
        );
      case "minimal":
        return (
          <MinimalClock
            seconds={seconds}
            isRunning={isRunning}
            background={background}
          />
        );
      case "digital":
        return (
          <DigitalClock
            seconds={seconds}
            isRunning={isRunning}
            background={background}
          />
        );
      default:
        return (
          <NormalClock
            seconds={seconds}
            isRunning={isRunning}
            background={background}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Clock Display */}
      <div className="transition-all duration-500 ease-in-out">
        {renderClock()}
      </div>

      {/* Clock Type Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Clock Style:
        </span>
        {CLOCK_TYPES.map((clockType) => (
          <button
            key={clockType.id}
            type="button"
            onClick={() => setSelectedClock(clockType.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              selectedClock === clockType.id
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
            aria-label={`Switch to ${clockType.label} clock`}
          >
            <span>{clockType.icon}</span>
            <span>{clockType.label}</span>
          </button>
        ))}
      </div>

      {/* Background Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Background:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {CLOCK_BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              type="button"
              onClick={() => setSelectedBackground(bg.id)}
              className={`flex items-center justify-center rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                selectedBackground === bg.id
                  ? "bg-indigo-500 text-white shadow-md scale-110"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:scale-105"
              }`}
              aria-label={`Switch to ${bg.name} background`}
              title={bg.name}
            >
              <span className="text-base">{bg.icon}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
