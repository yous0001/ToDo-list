"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useTheme } from "@/contexts/theme-context";

export const ThemeSwitcher = () => {
  const { themeId, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        event.target instanceof Node &&
        !wrapperRef.current.contains(event.target)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  const activeTheme = themes.find((theme) => theme.id === themeId);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 transition hover:border-white/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{
            background: activeTheme?.preview,
            boxShadow: "0 0 6px rgba(15,23,42,0.35)",
          }}
        />
        Themes
        <span className="text-[0.65rem] tracking-normal text-white/60">
          {activeTheme?.shortLabel}
        </span>
        <span className="text-base leading-none text-white/70">
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-3 w-56 rounded-3xl border border-white/15 bg-white/90 p-3 shadow-2xl">
          <p className="px-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
            Choose theme
          </p>
          <div className="mt-2 grid gap-2">
            {themes.map((option) => {
              const active = option.id === themeId;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setTheme(option.id);
                    close();
                  }}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-2 text-sm font-semibold text-slate-800 transition ${
                    active
                      ? "border-slate-300 bg-slate-50 shadow"
                      : "border-transparent hover:bg-slate-100"
                  }`}
                >
                  <span
                    className="h-8 w-8 rounded-xl"
                    style={{
                      background: option.preview,
                      boxShadow: "0 10px 20px rgba(15,23,42,0.2)",
                    }}
                  />
                  <span className="flex flex-col text-left">
                    <span>{option.label}</span>
                    <span className="text-xs font-normal text-slate-500">
                      {option.shortLabel}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

