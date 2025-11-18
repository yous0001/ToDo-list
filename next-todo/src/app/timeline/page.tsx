"use client";

import { useMemo } from "react";
import Link from "next/link";

import { SummaryPanel } from "@/components/summary-panel";
import { useTaskManager } from "@/hooks/use-task-manager";
import {
  DAY_IN_MS,
  formatDayLabel,
  formatDuration,
  startOfToday as getStartOfToday,
} from "@/utils/time";

export default function TimelinePage() {
  const { tasks, summary } = useTaskManager();

  const startOfToday = useMemo(() => getStartOfToday(), []);

  const weeklySummary = useMemo(() => {
    const base = startOfToday - 6 * DAY_IN_MS;
    return Array.from({ length: 7 }, (_, index) => {
      const dayStart = base + index * DAY_IN_MS;
      const dayEnd = dayStart + DAY_IN_MS;
      const started = tasks.filter(
        (task) =>
          task.firstStartedAt !== null &&
          task.firstStartedAt >= dayStart &&
          task.firstStartedAt < dayEnd
      ).length;
      const completed = tasks.filter(
        (task) =>
          task.completedAt !== null &&
          task.completedAt >= dayStart &&
          task.completedAt < dayEnd
      ).length;
      const focusSeconds = tasks.reduce((total, task) => {
        if (
          task.completedAt !== null &&
          task.completedAt >= dayStart &&
          task.completedAt < dayEnd
        ) {
          return total + task.elapsed;
        }
        return total;
      }, 0);
      return {
        dayStart,
        started,
        completed,
        focusSeconds,
      };
    });
  }, [tasks, startOfToday]);

  const weeklyTotals = useMemo(
    () =>
      weeklySummary.reduce(
        (acc, day) => ({
          started: acc.started + day.started,
          completed: acc.completed + day.completed,
          focusSeconds: acc.focusSeconds + day.focusSeconds,
        }),
        { started: 0, completed: 0, focusSeconds: 0 }
      ),
    [weeklySummary]
  );

  const maxWeeklyFocus = useMemo(
    () =>
      weeklySummary.reduce((max, day) => Math.max(max, day.focusSeconds), 0),
    [weeklySummary]
  );

  return (
    <div className="relative px-4 py-10 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="text-center text-white">
          <Link
            href="/"
            className="inline-block text-sm uppercase tracking-[0.4em] text-white/80 hover:text-white"
          >
            ← Back to home
          </Link>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Timeline
          </h1>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            View your weekly progress and time distribution
          </p>
        </header>

        <SummaryPanel summary={summary} />

        <section className="rounded-[28px] border border-white/20 bg-white/95 p-6 shadow-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Weekly timeline
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">
                Where your time went
              </h2>
              <p className="text-sm text-slate-500">
                Track starts, completions, and total focus time for the last 7
                days.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                This week
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatDuration(weeklyTotals.focusSeconds)}
              </p>
              <p>{weeklyTotals.completed} tasks completed</p>
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            {weeklySummary.map((day) => {
              const width =
                maxWeeklyFocus === 0
                  ? 0
                  : Math.max(
                      4,
                      Math.round((day.focusSeconds / maxWeeklyFocus) * 100)
                    );
              return (
                <li
                  key={day.dayStart}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="flex w-full items-center gap-4 sm:w-48">
                    <span className="text-sm font-semibold text-slate-800">
                      {formatDayLabel(day.dayStart)}
                    </span>
                    <div className="flex-1 rounded-full bg-slate-200/60">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-wrap gap-4 text-xs text-slate-500">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-700">
                      {formatDuration(day.focusSeconds)}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                      {day.completed} completed
                    </span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                      {day.started} started
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

