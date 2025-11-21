"use client";

import { useMemo, useState } from "react";

import { SummaryPanel } from "@/components/summary-panel";
import { useTaskManager } from "@/hooks/use-task-manager";
import {
  DAY_IN_MS,
  formatDuration,
  startOfToday as getStartOfToday,
} from "@/utils/time";

type TimelineRange = "week" | "month" | "year";

type TimelineBucket = {
  label: string;
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
  { id: "week", label: "Week view", detail: "Last 7 days" },
  { id: "month", label: "Month view", detail: "Last 4 weeks" },
  { id: "year", label: "Year view", detail: "Last 12 months" },
];

const WEEK_IN_MS = 7 * DAY_IN_MS;

const formatShortDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export default function TimelinePage() {
  const { tasks, summary } = useTaskManager();
  const [range, setRange] = useState<TimelineRange>("week");

  const startOfToday = useMemo(() => getStartOfToday(), []);

  const timelineBuckets = useMemo(() => {
    const aggregateRange = (
      label: string,
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
        rangeStart,
        rangeEnd,
        started,
        completed,
        focusSeconds,
      };
    };

    if (range === "month") {
      const base = startOfToday - 4 * WEEK_IN_MS + DAY_IN_MS;
      return Array.from({ length: 4 }, (_, index) => {
        const rangeStart = base + index * WEEK_IN_MS;
        const label = `Week of ${formatShortDate(rangeStart)}`;
        return aggregateRange(label, rangeStart, rangeStart + WEEK_IN_MS);
      });
    }

    if (range === "year") {
      const buckets: TimelineBucket[] = [];
      const current = new Date();
      current.setDate(1);
      current.setHours(0, 0, 0, 0);

      for (let i = 11; i >= 0; i -= 1) {
        const start = new Date(current);
        start.setMonth(start.getMonth() - i);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        const label = start.toLocaleDateString("en-US", { month: "short" });
        buckets.push(aggregateRange(label, start.getTime(), end.getTime()));
      }

      return buckets;
    }

    // default: week view
    const base = startOfToday - 6 * DAY_IN_MS;
    return Array.from({ length: 7 }, (_, index) => {
      const dayStart = base + index * DAY_IN_MS;
      return aggregateRange(formatShortDate(dayStart), dayStart, dayStart + DAY_IN_MS);
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

        <section className="rounded-[28px] border border-white/20 bg-white/95 p-6 shadow-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Timeline overview
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">
                Where your time went
              </h2>
              <p className="text-sm text-slate-500">
                Track starts, completions, and total focus time for any window.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow sm:flex-row sm:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  {activeRange?.detail}
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {formatDuration(totals.focusSeconds)}
                </p>
                <p>{totals.completed} tasks completed</p>
              </div>
              <label className="text-xs uppercase tracking-[0.35em] text-slate-400">
                View range
                <select
                  value={range}
                  onChange={(event) =>
                    setRange(event.target.value as TimelineRange)
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                >
                  {RANGE_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {timelineBuckets.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/80 p-8 text-center text-slate-500">
              Add tasks and start timers to see your historical progress.
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
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
                    className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="flex w-full items-center gap-4 sm:w-56">
                      <div className="min-w-[100px] text-sm font-semibold text-slate-800">
                        {bucket.label}
                      </div>
                      <div className="flex-1 rounded-full bg-slate-200/60">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-wrap gap-4 text-xs text-slate-500">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-700">
                        {formatDuration(bucket.focusSeconds)}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                        {bucket.completed} completed
                      </span>
                      <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                        {bucket.started} started
                      </span>
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


