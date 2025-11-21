"use client";

import { GlobalNav } from "@/components/global-nav";
import { useTheme } from "@/contexts/theme-context";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <div className={`relative min-h-screen text-white ${theme.background}`}>
      <div className={`pointer-events-none absolute inset-0 ${theme.overlay}`} />
      <GlobalNav />
      <main className="relative z-10 pt-8 pb-16 sm:pt-10 lg:pt-12">
        {children}
      </main>
    </div>
  );
};


