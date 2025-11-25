"use client";

import Link from "next/link";
import { Task } from "@/types/task";
import { formatDateTime, formatDuration } from "@/utils/time";

type TaskCardProps = {
  task: Task;
  seconds: number;
  collectionName?: string | null;
  collectionColor?: string | null;
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
  collectionName,
  collectionColor,
  onToggleComplete,
  onStart,
  onPause,
  onReset,
  onEdit,
  onDelete,
}: TaskCardProps) => {
  const startedLabel = formatDateTime(task.firstStartedAt);
  const finishedLabel = formatDateTime(task.completedAt);

  const infoLabel = (label: string | null) => label ?? "—";

  return (
    <li
      className={`group relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform hover:scale-[1.03] hover:shadow-2xl hover:border-white/30 ${
        task.completed ? "opacity-75" : ""
      }`}
    >
      {/* Default Compact View */}
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-3">
          {/* Complete Checkbox - Always visible if completed, hidden otherwise */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleComplete(task.id);
            }}
            className={`relative z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform will-change-transform ${
              task.completed
                ? "border-emerald-500 bg-emerald-500 text-white shadow-md opacity-100 scale-100"
                : "border-slate-300 text-transparent opacity-0 scale-90 group-hover:opacity-100 group-hover:border-slate-400 group-hover:scale-100 group-hover:shadow-sm"
            }`}
            aria-label={
              task.completed ? "Mark task as incomplete" : "Mark task as done"
            }
          >
            {task.completed ? "✓" : ""}
          </button>

          {/* Title and Timer - Always visible */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-slate-900 truncate">
              {task.title}
            </h2>
            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                ⏱️ {formatDuration(seconds)}
              </span>
              {task.running && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  ● Running
                </span>
              )}
              {task.completed && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  ✓ Completed
                </span>
              )}
              {collectionName && (
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                  style={{
                    background: collectionColor ?? "#0f172a",
                  }}
                >
                  {collectionName}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content on Hover */}
      <div className="relative z-20 max-h-0 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[max-height] group-hover:max-h-96 group-hover:pb-4">
        <div className="px-4 space-y-4 bg-white/95">
          {/* Description */}
          {task.description && (
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 opacity-0 translate-y-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] delay-100 will-change-[opacity,transform] group-hover:opacity-100 group-hover:translate-y-0">
              {task.description}
            </p>
          )}

          {/* Date Information */}
          <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-2 opacity-0 translate-y-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] delay-150 will-change-[opacity,transform] group-hover:opacity-100 group-hover:translate-y-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Started at:</span>
              <span className="text-slate-600">{infoLabel(startedLabel)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Finished at:</span>
              <span className="text-slate-600">{infoLabel(finishedLabel)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 opacity-0 translate-y-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] delay-200 will-change-[opacity,transform] group-hover:opacity-100 group-hover:translate-y-0">
            <Link
              href={`/tasks/${task.id}`}
              onClick={(e) => e.stopPropagation()}
              className="relative z-30 inline-flex items-center justify-center rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-indigo-100 px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform hover:scale-105 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-indigo-200 hover:shadow-md active:scale-95"
            >
              <span className="mr-1.5">👁️</span>
              View Task
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (task.running) {
                  onPause(task.id);
                } else {
                  onStart(task.id);
                }
              }}
              className={`relative z-30 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform hover:scale-105 hover:shadow-lg active:scale-95 ${
                task.running
                  ? "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700"
                  : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
              }`}
            >
              <span className="mr-1.5">
                {task.running ? "⏸️" : task.elapsed > 0 ? "▶️" : "▶️"}
              </span>
              {task.running ? "Pause" : task.elapsed > 0 ? "Resume" : "Start"}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onReset(task.id);
              }}
              disabled={task.elapsed === 0 && !task.running}
              className="relative z-30 inline-flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform enabled:hover:scale-105 enabled:hover:border-slate-300 enabled:hover:bg-slate-50 enabled:hover:text-slate-800 enabled:hover:shadow-md enabled:active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="mr-1.5">🔄</span>
              Reset
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(task);
              }}
              className="relative z-30 inline-flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform hover:scale-105 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 hover:shadow-md active:scale-95"
            >
              <span className="mr-1.5">✏️</span>
              Edit
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="relative z-30 inline-flex items-center justify-center rounded-xl border-2 border-transparent bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform hover:scale-105 hover:from-slate-900 hover:to-slate-950 hover:shadow-lg active:scale-95"
            >
              <span className="mr-1.5">🗑️</span>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Clickable overlay for navigation - only covers compact view */}
      <Link
        href={`/tasks/${task.id}`}
        className="absolute inset-0 z-0 group-hover:pointer-events-none"
        aria-label={`View details for ${task.title}`}
      />
    </li>
  );
};
