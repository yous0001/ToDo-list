"use client";

import { useMemo } from "react";
import Link from "next/link";

import { SummaryPanel } from "@/components/summary-panel";
import { useTaskManager } from "@/hooks/use-task-manager";
import {
  DAY_IN_MS,
  formatDayLabel,
  formatDuration,
  getDisplaySeconds,
  startOfToday as getStartOfToday,
} from "@/utils/time";

const SUGGESTIONS = [
  {
    title: "Deep work sprint",
    detail: "Block 25 minutes for your most strategic task.",
  },
  {
    title: "Energy check-in",
    detail: "Log a quick note about your energy after each session.",
  },
  {
    title: "Close the loop",
    detail: "Finish one task end-to-end before context switching.",
  },
] as const;

export default function DashboardPage() {
  const { tasks, summary, now } = useTaskManager();

  const startOfToday = useMemo(() => getStartOfToday(), []);

  const tasksWithSeconds = useMemo(
    () =>
      tasks.map((task) => ({
        task,
        seconds: getDisplaySeconds(task, now),
      })),
    [tasks, now]
  );

  const todaySeconds = useMemo(
    () =>
      tasksWithSeconds.reduce(
        (total, entry) =>
          entry.task.updatedAt >= startOfToday ? total + entry.seconds : total,
        0
      ),
    [tasksWithSeconds, startOfToday]
  );

  const longestSession = useMemo(() => {
    if (tasksWithSeconds.length === 0) {
      return null;
    }
    return tasksWithSeconds.reduce((longest, current) =>
      current.seconds > longest.seconds ? current : longest
    );
  }, [tasksWithSeconds]);

  const averageSessionMinutes = useMemo(
    () =>
      summary.total === 0
        ? 0
        : Math.max(1, Math.round(summary.totalSeconds / summary.total / 60)),
    [summary]
  );

  const completionRate = useMemo(
    () =>
      summary.total === 0
        ? 0
        : Math.min(100, Math.round((summary.completed / summary.total) * 100)),
    [summary]
  );

  const utilizationRate = useMemo(
    () =>
      summary.total === 0
        ? 0
        : Math.min(100, Math.round((summary.running / summary.total) * 100)),
    [summary]
  );

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
            Dashboard
          </h1>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            Track your productivity insights and progress
          </p>
        </header>

        <SummaryPanel summary={summary} />

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 text-white shadow-2xl backdrop-blur">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-5 shadow-inner">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                  Today&rsquo;s focus
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {formatDuration(todaySeconds)}
                </p>
                <p className="text-sm text-white/80">
                  {todaySeconds === 0
                    ? "Log your first minute today"
                    : `≈ ${Math.round(todaySeconds / 60)} min tracked`}
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 shadow-inner">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                  Avg session
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {averageSessionMinutes ? `${averageSessionMinutes} min` : "—"}
                </p>
                <p className="text-sm text-white/80">Per tracked task</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 shadow-inner">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                  Deepest work
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {longestSession
                    ? longestSession.task.title
                    : "No session yet"}
                </p>
                <p className="text-sm text-white/80">
                  {longestSession
                    ? formatDuration(longestSession.seconds)
                    : "Start any timer"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/70">
                <span>Completion</span>
                <span>{completionRate}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/15">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-white/70">
                {completionRate}% of tasks done • {utilizationRate}% currently
                running
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/15 bg-white/95 p-6 text-slate-900 shadow-2xl">
              <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
                Session suggestions
              </h3>
              <ul className="mt-4 space-y-4">
                {SUGGESTIONS.map((suggestion) => (
                  <li
                    key={suggestion.title}
                    className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm shadow-sm"
                  >
                    <p className="font-semibold text-slate-900">
                      {suggestion.title}
                    </p>
                    <p className="text-slate-500">{suggestion.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/95 p-6 text-slate-900 shadow-2xl">
              <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
                Weekly cadence
              </h3>
              <p className="text-sm text-slate-500">
                {weeklyTotals.completed} done •{" "}
                {formatDuration(weeklyTotals.focusSeconds)} focused
              </p>
              <ul className="mt-4 space-y-3">
                {weeklySummary.map((day) => {
                  const width =
                    maxWeeklyFocus === 0
                      ? 0
                      : Math.max(
                          4,
                          Math.round((day.focusSeconds / maxWeeklyFocus) * 100)
                        );
                  return (
                    <li className="flex items-center gap-3" key={day.dayStart}>
                      <span className="w-12 text-sm font-semibold text-slate-700">
                        {formatDayLabel(day.dayStart)}
                      </span>
                      <div className="flex-1 rounded-full bg-slate-200/60">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <div className="flex flex-col text-xs text-slate-500">
                        <span>{day.completed} done</span>
                        <span>{day.started} started</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
