"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTheme } from "@/contexts/theme-context";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserMenu } from "@/components/user-menu";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tasks", label: "Tasks" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/timeline", label: "Timeline" },
] as const;

const isActivePath = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
};

export const GlobalNav = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/15 ${theme.nav} backdrop-blur-xl`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:flex-wrap md:items-center">
        <div className="flex w-full items-center justify-between md:w-auto md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-white transition hover:text-indigo-300"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-xl text-white">
              ●
            </span>
            Smart Todo
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white/60 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span className="text-lg">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        <nav
          className={`${
            mobileOpen ? "flex" : "hidden"
          } w-full flex-col gap-2 rounded-3xl border border-white/10 bg-white/5 p-3 text-sm font-semibold text-white/80 md:flex md:flex-1 md:flex-row md:flex-wrap md:rounded-none md:border-none md:bg-transparent md:p-0 md:gap-1 md:justify-center`}
        >
          {NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-center transition ${
                  active
                    ? "bg-white text-slate-900 shadow-lg"
                    : "border border-white/20 text-white/80 hover:border-white/40 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div
          className={`flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:justify-end ${
            mobileOpen ? "block" : "hidden md:flex"
          }`}
        >
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
