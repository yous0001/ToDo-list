"use client";

type AppLogoProps = {
  size?: number;
};

export const AppLogo = ({ size = 24 }: AppLogoProps) => {
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ fontSize: `${size}px` }}
    >
      <span className="font-bold tracking-tight text-inherit">planora</span>
    </div>
  );
};
