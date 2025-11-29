"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/contexts/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const responseMessage = await register({ name, email, password });
      setMessage(responseMessage);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative px-4 py-10 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-[32px] border border-white/15 bg-white/10 p-8 text-white shadow-2xl backdrop-blur">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">
            Join Planora
          </p>
          <h1 className="text-4xl font-bold">Create your Planora account</h1>
          <p className="text-sm text-white/70">
            Plan tasks, track focus sessions, and stay accountable.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="flex flex-col gap-2 text-sm font-semibold text-white/80">
            Full name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/50 outline-none transition focus:border-white/60"
              placeholder="Alex Productivity"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-white/80">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/50 outline-none transition focus:border-white/60"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-white/80">
            Password
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/50 outline-none transition focus:border-white/60"
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
          </label>

          {message && (
            <p className="rounded-2xl border border-emerald-200/60 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-50">
              {message}
            </p>
          )}

          {error && (
            <p className="rounded-2xl border border-rose-200/60 bg-rose-500/10 px-4 py-3 text-sm text-rose-50">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-white">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

