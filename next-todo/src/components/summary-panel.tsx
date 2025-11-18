"use client";

import { TaskSummary } from "@/hooks/use-task-manager";
import { formatDuration } from "@/utils/time";

type SummaryPanelProps = {
  summary: TaskSummary;
};

export const SummaryPanel = ({ summary }: SummaryPanelProps) => {
  return (
    <section className="rounded-[28px] border border-white/15 bg-slate-900/50 p-6 text-white shadow-2xl backdrop-blur">
      <div className="grid gap-6 text-center sm:grid-cols-3 sm:text-left">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">Tasks</p>
          <p className="mt-2 text-3xl font-semibold">{summary.total}</p>
          <p className="text-sm text-white/70">
            {summary.completed} completed • {summary.running} running
          </p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">Focus time</p>
          <p className="mt-2 text-3xl font-semibold">
            {formatDuration(summary.totalSeconds)}
          </p>
          <p className="text-sm text-white/70">Tracked across all tasks</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">Active timers</p>
          <p className="mt-2 text-3xl font-semibold">{summary.running}</p>
          <p className="text-sm text-white/70">
            {summary.running ? "Stay focused!" : "No active sessions"}
          </p>
        </div>
      </div>
    </section>
  );
};

