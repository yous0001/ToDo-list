"use client";

import { useState } from "react";
import { NormalClock } from "./normal-clock";
import { FlipClock } from "./flip-clock";
import { AnalogClock } from "./analog-clock";
import { MinimalClock } from "./minimal-clock";
import { DigitalClock } from "./digital-clock";

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

  const renderClock = () => {
    switch (selectedClock) {
      case "normal":
        return <NormalClock seconds={seconds} isRunning={isRunning} />;
      case "flip":
        return <FlipClock seconds={seconds} isRunning={isRunning} />;
      case "analog":
        return <AnalogClock seconds={seconds} isRunning={isRunning} />;
      case "minimal":
        return <MinimalClock seconds={seconds} isRunning={isRunning} />;
      case "digital":
        return <DigitalClock seconds={seconds} isRunning={isRunning} />;
      default:
        return <NormalClock seconds={seconds} isRunning={isRunning} />;
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
    </div>
  );
};
