export type ClockBackground = 
  | "slate-dark"
  | "indigo-gradient"
  | "purple-gradient"
  | "emerald-gradient"
  | "rose-gradient"
  | "amber-gradient"
  | "cyan-gradient"
  | "violet-gradient"
  | "ocean"
  | "sunset"
  | "forest"
  | "cosmic"
  | "neon"
  | "minimal-light"
  | "minimal-dark"
  | "paper"
  | "glass";

export type BackgroundTheme = {
  id: ClockBackground;
  name: string;
  icon: string;
  baseClasses: string;
  fullscreenClasses: string;
  titleClasses: string;
  fullscreenTitleClasses: string;
  buttonClasses: string;
};

export const CLOCK_BACKGROUNDS: BackgroundTheme[] = [
  {
    id: "slate-dark",
    name: "Slate Dark",
    icon: "🌑",
    baseClasses: "rounded-2xl border-2 border-slate-300/50 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-slate-300/50 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-300",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-slate-200",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-xs font-semibold text-white/80 backdrop-blur-sm transition hover:border-white/60 hover:bg-black/50",
  },
  {
    id: "indigo-gradient",
    name: "Indigo",
    icon: "💙",
    baseClasses: "rounded-2xl border-2 border-indigo-300/50 bg-linear-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-indigo-300/50 bg-linear-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-indigo-100",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-indigo-50",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-indigo-800/40 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/50 hover:bg-indigo-800/60",
  },
  {
    id: "purple-gradient",
    name: "Purple",
    icon: "💜",
    baseClasses: "rounded-2xl border-2 border-purple-300/50 bg-linear-to-br from-purple-600 via-purple-700 to-purple-900 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-purple-300/50 bg-linear-to-br from-purple-600 via-purple-700 to-purple-900 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-purple-100",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-purple-50",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-purple-800/40 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/50 hover:bg-purple-800/60",
  },
  {
    id: "emerald-gradient",
    name: "Emerald",
    icon: "💚",
    baseClasses: "rounded-2xl border-2 border-emerald-300/50 bg-linear-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-emerald-300/50 bg-linear-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-emerald-100",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-emerald-50",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-emerald-800/40 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/50 hover:bg-emerald-800/60",
  },
  {
    id: "rose-gradient",
    name: "Rose",
    icon: "🌹",
    baseClasses: "rounded-2xl border-2 border-rose-300/50 bg-linear-to-br from-rose-600 via-rose-700 to-rose-900 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-rose-300/50 bg-linear-to-br from-rose-600 via-rose-700 to-rose-900 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-rose-100",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-rose-50",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-rose-800/40 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/50 hover:bg-rose-800/60",
  },
  {
    id: "amber-gradient",
    name: "Amber",
    icon: "🌅",
    baseClasses: "rounded-2xl border-2 border-amber-300/50 bg-linear-to-br from-amber-600 via-amber-700 to-amber-900 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-amber-300/50 bg-linear-to-br from-amber-600 via-amber-700 to-amber-900 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-amber-100",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-amber-50",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-amber-800/40 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/50 hover:bg-amber-800/60",
  },
  {
    id: "cyan-gradient",
    name: "Cyan",
    icon: "🌊",
    baseClasses: "rounded-2xl border-2 border-cyan-300/50 bg-linear-to-br from-cyan-600 via-cyan-700 to-cyan-900 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-cyan-300/50 bg-linear-to-br from-cyan-600 via-cyan-700 to-cyan-900 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-cyan-100",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-cyan-50",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-cyan-800/40 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/50 hover:bg-cyan-800/60",
  },
  {
    id: "violet-gradient",
    name: "Violet",
    icon: "🔮",
    baseClasses: "rounded-2xl border-2 border-violet-300/50 bg-linear-to-br from-violet-600 via-violet-700 to-violet-900 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-violet-300/50 bg-linear-to-br from-violet-600 via-violet-700 to-violet-900 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-violet-100",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-violet-50",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-violet-800/40 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/50 hover:bg-violet-800/60",
  },
  {
    id: "ocean",
    name: "Ocean",
    icon: "🌊",
    baseClasses: "rounded-2xl border-2 border-blue-300/50 bg-linear-to-br from-blue-500 via-cyan-500 to-teal-600 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-blue-300/50 bg-linear-to-br from-blue-500 via-cyan-500 to-teal-600 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-blue-50",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-white",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-blue-600/40 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/50 hover:bg-blue-600/60",
  },
  {
    id: "sunset",
    name: "Sunset",
    icon: "🌇",
    baseClasses: "rounded-2xl border-2 border-orange-300/50 bg-linear-to-br from-orange-500 via-pink-500 to-rose-600 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-orange-300/50 bg-linear-to-br from-orange-500 via-pink-500 to-rose-600 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-orange-50",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-white",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-orange-600/40 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/50 hover:bg-orange-600/60",
  },
  {
    id: "forest",
    name: "Forest",
    icon: "🌲",
    baseClasses: "rounded-2xl border-2 border-green-300/50 bg-linear-to-br from-green-600 via-emerald-600 to-teal-700 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-green-300/50 bg-linear-to-br from-green-600 via-emerald-600 to-teal-700 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-green-50",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-white",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-green-700/40 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/50 hover:bg-green-700/60",
  },
  {
    id: "cosmic",
    name: "Cosmic",
    icon: "🌌",
    baseClasses: "rounded-2xl border-2 border-purple-300/50 bg-linear-to-br from-purple-900 via-indigo-900 to-slate-900 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-purple-300/50 bg-linear-to-br from-purple-900 via-indigo-900 to-slate-900 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-purple-200",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-purple-100",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-purple-900/40 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/50 hover:bg-purple-900/60",
  },
  {
    id: "neon",
    name: "Neon",
    icon: "💡",
    baseClasses: "rounded-2xl border-2 border-pink-400/50 bg-linear-to-br from-pink-900 via-purple-900 to-indigo-900 p-6 shadow-xl shadow-pink-500/20",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-pink-400/50 bg-linear-to-br from-pink-900 via-purple-900 to-indigo-900 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-pink-200",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-pink-100",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-pink-400/50 bg-pink-900/40 text-xs font-semibold text-pink-200/90 backdrop-blur-sm transition hover:border-pink-300/70 hover:bg-pink-900/60",
  },
  {
    id: "minimal-light",
    name: "Minimal Light",
    icon: "⚪",
    baseClasses: "rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-slate-200 bg-white p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-600",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-slate-700",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-xs font-semibold text-slate-700 backdrop-blur-sm transition hover:border-slate-400 hover:bg-slate-200",
  },
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    icon: "⚫",
    baseClasses: "rounded-2xl border-2 border-slate-700 bg-slate-800 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-slate-700 bg-slate-800 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-300",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-slate-200",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 bg-slate-700/50 text-xs font-semibold text-slate-200 backdrop-blur-sm transition hover:border-slate-500 hover:bg-slate-700",
  },
  {
    id: "paper",
    name: "Paper",
    icon: "📄",
    baseClasses: "rounded-2xl border-2 border-amber-200/50 bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-amber-200/50 bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-amber-800",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-amber-900",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-300 bg-amber-200/50 text-xs font-semibold text-amber-800 backdrop-blur-sm transition hover:border-amber-400 hover:bg-amber-200/70",
  },
  {
    id: "glass",
    name: "Glass",
    icon: "🔲",
    baseClasses: "rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-xl",
    fullscreenClasses: "flex min-h-screen w-full flex-col items-center justify-center gap-6 border border-white/20 bg-white/10 backdrop-blur-xl p-8 text-center shadow-none",
    titleClasses: "text-center text-xs font-bold uppercase tracking-[0.3em] text-white/90",
    fullscreenTitleClasses: "text-center text-sm font-bold uppercase tracking-[0.45em] text-white",
    buttonClasses: "absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/20 text-xs font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/30",
  },
];

export const getBackgroundTheme = (
  background: ClockBackground
): BackgroundTheme => {
  return (
    CLOCK_BACKGROUNDS.find((bg) => bg.id === background) ?? CLOCK_BACKGROUNDS[0]
  );
};




