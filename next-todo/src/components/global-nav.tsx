"use client";

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

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/15 ${theme.nav} backdrop-blur-xl`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4 sm:flex-nowrap">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-white transition hover:text-indigo-300"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-xl text-white">
            ●
          </span>
          Smart Todo
        </Link>

        <nav className="flex flex-1 flex-wrap justify-center gap-1 text-sm font-semibold text-white/80 sm:justify-center">
          {NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 transition ${
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

        <div className="flex w-full flex-1 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
