"use client";

import { useMemo, useState } from "react";

import { SummaryPanel } from "@/components/summary-panel";
import { useTaskManager } from "@/hooks/use-task-manager";
import { useTheme } from "@/contexts/theme-context";
import { useAuth } from "@/contexts/auth-context";
import { SignInRequired } from "@/components/auth/sign-in-required";
import {
  DAY_IN_MS,
  formatDuration,
  startOfToday as getStartOfToday,
} from "@/utils/time";

type TimelineRange = "week" | "month" | "year";

type TimelineBucket = {
  label: string;
  subLabel: string;
  rangeStart: number;
  rangeEnd: number;
  started: number;
  completed: number;
  focusSeconds: number;
};

const RANGE_OPTIONS: Array<{
  id: TimelineRange;
  label: string;
  detail: string;
}> = [
  { id: "week", label: "Week", detail: "7 days" },
  { id: "month", label: "Month", detail: "4 weeks" },
  { id: "year", label: "Year", detail: "12 months" },
];

const WEEK_IN_MS = 7 * DAY_IN_MS;

const formatShortDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const formatMonthYear = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
  });

export default function TimelinePage() {
  const { tasks, summary } = useTaskManager();
  const { theme } = useTheme();
  const [range, setRange] = useState<TimelineRange>("week");
  const { user, loading: authLoading } = useAuth();

  const startOfToday = useMemo(() => getStartOfToday(), []);

  const timelineBuckets = useMemo(() => {
    const aggregateRange = (
      label: string,
      subLabel: string,
      rangeStart: number,
      rangeEnd: number
    ): TimelineBucket => {
      let started = 0;
      let completed = 0;
      let focusSeconds = 0;

      tasks.forEach((task) => {
        if (
          task.firstStartedAt !== null &&
          task.firstStartedAt >= rangeStart &&
          task.firstStartedAt < rangeEnd
        ) {
          started += 1;
        }
        if (
          task.completedAt !== null &&
          task.completedAt >= rangeStart &&
          task.completedAt < rangeEnd
        ) {
          completed += 1;
          focusSeconds += task.elapsed;
        }
      });

      return {
        label,
        subLabel,
        rangeStart,
        rangeEnd,
        started,
        completed,
        focusSeconds,
      };
    };

    if (range === "month") {
      const base = startOfToday - 4 * WEEK_IN_MS;
      return Array.from({ length: 4 }, (_, index) => {
        const rangeStart = base + index * WEEK_IN_MS;
        const rangeEnd = rangeStart + WEEK_IN_MS;
        const label = `Week ${index + 1}`;
        const subLabel = `${formatShortDate(rangeStart)} – ${formatShortDate(
          rangeEnd - DAY_IN_MS
        )}`;
        return aggregateRange(label, subLabel, rangeStart, rangeEnd);
      });
    }

    if (range === "year") {
      return Array.from({ length: 12 }, (_, idx) => {
        const start = new Date(startOfToday);
        start.setMonth(start.getMonth() - (11 - idx));
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        const label = formatMonthYear(start.getTime());
        const subLabel = `${start.getFullYear()}`;
        return aggregateRange(label, subLabel, start.getTime(), end.getTime());
      });
    }

    // default week view
    const base = startOfToday - 6 * DAY_IN_MS;
    return Array.from({ length: 7 }, (_, index) => {
      const dayStart = base + index * DAY_IN_MS;
      const label = formatShortDate(dayStart);
      const subLabel = new Date(dayStart).toLocaleDateString("en-US", {
        weekday: "short",
      });
      return aggregateRange(label, subLabel, dayStart, dayStart + DAY_IN_MS);
    });
  }, [tasks, range, startOfToday]);

  const totals = useMemo(
    () =>
      timelineBuckets.reduce(
        (acc, bucket) => ({
          started: acc.started + bucket.started,
          completed: acc.completed + bucket.completed,
          focusSeconds: acc.focusSeconds + bucket.focusSeconds,
        }),
        { started: 0, completed: 0, focusSeconds: 0 }
      ),
    [timelineBuckets]
  );

  const maxFocus = useMemo(
    () =>
      timelineBuckets.reduce(
        (max, bucket) => Math.max(max, bucket.focusSeconds),
        0
      ),
    [timelineBuckets]
  );

  const activeRange = RANGE_OPTIONS.find((option) => option.id === range);
  const isYearView = range === "year";

  if (!user && !authLoading) {
    return (
      <div className="relative px-4 py-10 font-sans sm:px-6 lg:px-8">
        <SignInRequired
          title="Sign in to view your timeline"
          description="Visualize weekly, monthly, or yearly focus trends once you log in."
        />
      </div>
    );
  }

  return (
    <div className="relative px-4 py-10 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="text-center text-white">
          <p className="text-sm uppercase tracking-[0.4em] text-white/80">
            Progress intelligence
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Timeline
          </h1>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            Zoom into your focus history by week, month, or year.
          </p>
        </header>

        <SummaryPanel summary={summary} />

        <section className="rounded-[28px] border border-white/15 bg-white/95 p-6 shadow-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Timeline overview
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">
                Where your time went
              </h2>
              <p className="text-sm text-slate-500">
                Compare focus streaks just like Google Calendar’s view switcher.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow">
              <div className="flex flex-wrap gap-2 rounded-full border border-slate-200 bg-slate-100/70 p-1">
                {RANGE_OPTIONS.map((option) => {
                  const active = option.id === range;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setRange(option.id)}
                      className={`flex-1 min-w-[90px] rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "bg-white text-slate-900 shadow"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <span className="block text-[0.6rem] uppercase tracking-[0.35em] text-slate-400">
                        {option.detail}
                      </span>
                      <span className="text-sm">{option.label}</span>
                    </button>
                  );
                })}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  {activeRange?.detail}
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {formatDuration(totals.focusSeconds)}
                </p>
                <p className="text-sm text-slate-500">
                  {totals.completed} tasks completed · {totals.started} started
                </p>
              </div>
            </div>
          </div>

          {timelineBuckets.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/80 p-8 text-center text-slate-500">
              Add tasks and start timers to build your timeline.
            </div>
          ) : isYearView ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {timelineBuckets.map((bucket) => {
                const percent =
                  maxFocus === 0
                    ? 0
                    : Math.round((bucket.focusSeconds / maxFocus) * 100);
                const circumference = 2 * Math.PI * 32;
                const offset =
                  circumference - (circumference * Math.min(percent, 100)) / 100;
                return (
                  <div
                    key={`${bucket.label}-${bucket.rangeStart}`}
                    className="rounded-[26px] border border-slate-200/80 bg-white/95 p-5 shadow-sm transition hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                          {bucket.subLabel}
                        </p>
                        <h3 className="text-2xl font-semibold text-slate-900">
                          {bucket.label}
                        </h3>
                      </div>
                      <div className="relative h-20 w-20">
                        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="#e2e8f0"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="url(#timelineRing)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            fill="none"
                          />
                          <defs>
                            <linearGradient
                              id="timelineRing"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-900">
                          {percent}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-3 py-2">
                        <span>Focus time</span>
                        <span className="font-semibold text-slate-900">
                          {formatDuration(bucket.focusSeconds)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-emerald-800">
                        <span>Completed</span>
                        <span className="font-semibold">
                          {bucket.completed}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-amber-800">
                        <span>Started</span>
                        <span className="font-semibold">{bucket.started}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {timelineBuckets.map((bucket) => {
                const width =
                  maxFocus === 0
                    ? 0
                    : Math.max(
                        4,
                        Math.round((bucket.focusSeconds / maxFocus) * 100)
                      );
                return (
                  <li
                    key={`${bucket.label}-${bucket.rangeStart}`}
                    className="grid gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:grid-cols-[180px,1fr]"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                        {bucket.subLabel}
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        {bucket.label}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="w-full rounded-full bg-slate-100 lg:flex-1">
                        <div
                          className={`h-3 rounded-full bg-gradient-to-r ${theme.accent}`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                        <span className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-900">
                          {formatDuration(bucket.focusSeconds)}
                        </span>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                          {bucket.completed} completed
                        </span>
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                          {bucket.started} started
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}


