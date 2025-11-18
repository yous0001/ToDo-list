"use client";

import { Task } from "@/types/task";
import { formatDateTime, formatDuration } from "@/utils/time";

type TaskCardProps = {
  task: Task;
  seconds: number;
  onToggleComplete: (id: string) => void;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export const TaskCard = ({
  task,
  seconds,
  onToggleComplete,
  onStart,
  onPause,
  onReset,
  onEdit,
  onDelete,
}: TaskCardProps) => {
  const createdLabel = formatDateTime(task.createdAt);
  const startedLabel = formatDateTime(task.firstStartedAt);
  const finishedLabel = formatDateTime(task.completedAt);

  const infoLabel = (label: string | null) => label ?? "—";

  return (
    <li
      className={`rounded-[28px] border border-white/20 bg-white/95 p-6 shadow-2xl transition hover:-translate-y-0.5 ${
        task.completed ? "opacity-75" : ""
      }`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-1 items-start gap-4">
            <button
              type="button"
              onClick={() => onToggleComplete(task.id)}
              className={`mt-1 flex h-11 w-11 items-center justify-center rounded-full border text-lg transition ${
                task.completed
                  ? "border-emerald-500 bg-emerald-500 text-white shadow-md"
                  : "border-slate-200 text-slate-400 hover:text-slate-600"
              }`}
              aria-label={
                task.completed ? "Mark task as incomplete" : "Mark task as done"
              }
            >
              {task.completed ? "✓" : ""}
            </button>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {task.title}
              </h2>
              {task.description && (
                <p className="mt-1 text-base text-slate-500">
                  {task.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">
                  {formatDuration(seconds)}
                </span>
                {task.running && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Running
                  </span>
                )}
                {task.completed && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Completed
                  </span>
                )}
              </div>
              <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
                <p>
                  <span className="font-semibold text-slate-700">Created:</span>{" "}
                  <span>{infoLabel(createdLabel)}</span>
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Started:</span>{" "}
                  <span>{infoLabel(startedLabel)}</span>
                </p>
                <p>
                  <span className="font-semibold text-slate-700">
                    Finished:
                  </span>{" "}
                  <span>{infoLabel(finishedLabel)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => (task.running ? onPause(task.id) : onStart(task.id))}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold text-white shadow ${
              task.running
                ? "bg-rose-500 hover:bg-rose-500/90"
                : "bg-indigo-500 hover:bg-indigo-500/90"
            }`}
          >
            {task.running
              ? "Pause timer"
              : task.elapsed > 0
              ? "Resume timer"
              : "Start timer"}
          </button>
          <button
            type="button"
            onClick={() => onReset(task.id)}
            disabled={task.elapsed === 0 && !task.running}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition enabled:hover:border-slate-300 enabled:hover:text-slate-800 disabled:opacity-40"
          >
            Reset timer
          </button>
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="rounded-2xl border border-transparent bg-slate-900/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};
