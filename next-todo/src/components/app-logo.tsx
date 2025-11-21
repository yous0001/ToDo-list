"use client";

type AppLogoProps = {
  size?: number;
};

export const AppLogo = ({ size = 48 }: AppLogoProps) => (
  <div
    className="inline-flex items-center justify-center rounded-[14px] bg-white/10 p-2 shadow-inner shadow-slate-900/30"
    style={{ width: size, height: size }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      role="img"
      aria-label="Smart Doc logo"
    >
      <defs>
        <linearGradient id="docGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect
        x="6"
        y="6"
        width="30"
        height="36"
        rx="6"
        fill="url(#docGradient)"
      />
      <rect x="12" y="18" width="18" height="3" rx="1.5" fill="#f8fafc" />
      <rect x="12" y="24" width="14" height="3" rx="1.5" fill="#f8fafc" />
      <rect x="12" y="30" width="10" height="3" rx="1.5" fill="#f8fafc" />
      <path
        d="M36 17c0-2.21-1.79-4-4-4h-2v12h6V17z"
        fill="#fef3c7"
        opacity="0.8"
      />
    </svg>
  </div>
);


