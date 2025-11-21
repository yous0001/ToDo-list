"use client";

import { useTheme } from "@/contexts/theme-context";

export const ThemeSwitcher = () => {
  const { themeId, setTheme, themes } = useTheme();

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/20 bg-white/5 px-2 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
      <span className="ml-1">Theme</span>
      <div className="flex flex-wrap gap-1">
        {themes.map((option) => {
          const active = option.id === themeId;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setTheme(option.id)}
              className={`group inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.7rem] normal-case tracking-normal transition ${
                active
                  ? "bg-white text-slate-900 shadow-lg"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background: option.preview,
                  boxShadow: active ? "0 0 6px rgba(15,23,42,0.35)" : undefined,
                }}
              />
              {option.shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
};


