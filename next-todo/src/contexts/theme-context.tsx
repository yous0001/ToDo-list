"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

type ThemeOption = {
  id: string;
  label: string;
  shortLabel: string;
  background: string;
  overlay: string;
  accent: string;
  nav: string;
  preview: string;
};

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "aurora",
    label: "Aurora Glow",
    shortLabel: "Aurora",
    background:
      "bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b]",
    overlay:
      "bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.45),_transparent_55%)]",
    accent: "from-indigo-500 via-purple-500 to-pink-500",
    nav: "bg-slate-950/70",
    preview: "linear-gradient(135deg,#8b5cf6,#ec4899)",
  },
  {
    id: "dawn",
    label: "Dawn Rise",
    shortLabel: "Dawn",
    background:
      "bg-gradient-to-br from-[#2a0f27] via-[#7c2d12] to-[#92400e]",
    overlay:
      "bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.4),_transparent_55%)]",
    accent: "from-orange-500 via-amber-500 to-rose-500",
    nav: "bg-[#2f0d1c]/70",
    preview: "linear-gradient(135deg,#fb923c,#f43f5e)",
  },
  {
    id: "ocean",
    label: "Ocean Mist",
    shortLabel: "Lagoon",
    background:
      "bg-gradient-to-br from-[#0f172a] via-[#0f766e] to-[#134e4a]",
    overlay:
      "bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.35),_transparent_50%)]",
    accent: "from-cyan-400 via-sky-500 to-emerald-400",
    nav: "bg-[#04121a]/70",
    preview: "linear-gradient(135deg,#22d3ee,#34d399)",
  },
  {
    id: "noir",
    label: "Noir Focus",
    shortLabel: "Noir",
    background:
      "bg-gradient-to-br from-[#020617] via-[#111827] to-[#0f172a]",
    overlay:
      "bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_55%)]",
    accent: "from-slate-100 via-slate-300 to-white",
    nav: "bg-[#0f172a]/70",
    preview: "linear-gradient(135deg,#f8fafc,#94a3b8)",
  },
];

type ThemeContextValue = {
  theme: ThemeOption;
  themeId: string;
  setTheme: (id: string) => void;
  themes: ThemeOption[];
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "smart-todo-theme";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeId, setThemeId] = useState<string>(THEME_OPTIONS[0].id);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored !== themeId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeId(stored);
    }
  }, [themeId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(STORAGE_KEY, themeId);
  }, [themeId]);

  const value = useMemo(() => {
    const theme =
      THEME_OPTIONS.find((option) => option.id === themeId) ??
      THEME_OPTIONS[0];
    return {
      theme,
      themeId: theme.id,
      setTheme: setThemeId,
      themes: THEME_OPTIONS,
    };
  }, [themeId]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

