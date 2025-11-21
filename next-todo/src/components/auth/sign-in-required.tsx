"use client";

import Link from "next/link";

type SignInRequiredProps = {
  title?: string;
  description?: string;
};

export const SignInRequired = ({
  title = "Sign in to keep going",
  description = "Create an account or log in to track tasks across devices.",
}: SignInRequiredProps) => (
  <div className="mx-auto max-w-2xl rounded-[32px] border border-white/15 bg-white/10 p-10 text-center text-white shadow-2xl backdrop-blur">
    <p className="text-xs uppercase tracking-[0.4em] text-white/70">
      Authentication required
    </p>
    <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
    <p className="mt-3 text-white/80">{description}</p>
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <Link
        href="/login"
        className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/60"
      >
        Log in
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
      >
        Sign up
      </Link>
    </div>
  </div>
);


