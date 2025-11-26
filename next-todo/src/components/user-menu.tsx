"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/contexts/auth-context";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link
          href="/login"
          className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white shadow-lg transition hover:border-white/50"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/20 text-sm font-bold text-white">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          ) : (
            getInitials(user.name)
          )}
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-xs uppercase tracking-[0.35em] text-white/60">
            Account
          </span>
          <span>{user.name}</span>
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-3 w-72 rounded-3xl border border-white/15 bg-white/10 p-5 text-sm text-white shadow-2xl backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white/20 text-lg font-bold text-white">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                Signed in
              </p>
              <p className="text-base font-semibold">{user.name}</p>
              <p className="text-xs text-white/70">{user.email}</p>
            </div>
          </div>
          {(user.role || user.location) && (
            <p className="mt-3 text-xs text-white/70">
              {user.role && <span className="font-semibold">{user.role}</span>}
              {user.role && user.location && <span className="mx-1">•</span>}
              {user.location}
            </p>
          )}
          <hr className="my-4 border-white/20" />
          <div className="flex flex-col gap-2">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="rounded-2xl border border-white/20 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/90 transition hover:border-white/50"
            >
              View profile
            </Link>
            <Link
              href="/tasks"
              onClick={() => setOpen(false)}
              className="rounded-2xl border border-white/20 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/50"
            >
              Tasks
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="rounded-2xl bg-white/90 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-white"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

