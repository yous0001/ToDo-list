"use client";

import Link from "next/link";
import { useTaskManager } from "@/hooks/use-task-manager";
import { formatDuration } from "@/utils/time";

const NAV_CARDS = [
  {
    href: "/tasks",
    title: "Tasks",
    description: "Manage all your tasks with timers",
    icon: "📋",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "View productivity insights and stats",
    icon: "📊",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    href: "/timeline",
    title: "Timeline",
    description: "Track your weekly progress",
    icon: "📅",
    gradient: "from-emerald-500 to-teal-500",
  },
] as const;

export default function HomePage() {
  const { summary, loading } = useTaskManager();

  return (
    <div className="relative min-h-screen px-4 py-10 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="text-center text-white">
          <p className="text-sm uppercase tracking-[0.4em] text-white/80">
            Focused productivity
          </p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl">
            Planora
          </h1>
          <p className="mt-4 text-lg text-white/90 sm:text-xl">
            Capture tasks, track time, and achieve more with data-driven
            insights
          </p>
        </header>

        {!loading && (
          <section className="rounded-[32px] border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-lg">
            <h2 className="text-center text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
              Your Progress
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 text-center shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Total Tasks
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {summary.total}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {summary.completed} completed
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 text-center shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Time Tracked
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {formatDuration(summary.totalSeconds)}
                </p>
                <p className="mt-1 text-sm text-slate-600">Across all tasks</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 text-center shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Currently Running
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {summary.running}
                </p>
                <p className="mt-1 text-sm text-slate-600">Active timers</p>
              </div>
            </div>
          </section>
        )}

        <section className="grid gap-6 md:grid-cols-3">
          {NAV_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-[28px] border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-lg transition hover:scale-105 hover:shadow-3xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition group-hover:opacity-10`}
              />
              <div className="relative">
                <div className="text-5xl">{card.icon}</div>
                <h3 className="mt-4 text-2xl font-bold text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {card.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:gap-3 transition-all">
                  Go to {card.title}
                  <span className="text-lg">→</span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="rounded-[28px] border border-white/15 bg-white/10 p-8 text-center text-white shadow-2xl backdrop-blur">
          <h3 className="text-2xl font-bold">Ready to boost productivity?</h3>
          <p className="mt-2 text-white/80">
            Start by adding your first task and tracking your progress.
          </p>
          <Link
            href="/tasks"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:opacity-95"
          >
            Get Started
          </Link>
        </section>
      </div>
    </div>
  );
}
