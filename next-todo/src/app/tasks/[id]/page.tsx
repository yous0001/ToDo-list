"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTaskManager } from "@/hooks/use-task-manager";
import { useCollections } from "@/hooks/use-collections";
import { TaskComposerModal } from "@/components/task-composer-modal";
import { ClockSelector } from "@/components/clocks/clock-selector";
import {
  formatDateTime,
  formatDuration,
  getDisplaySeconds,
} from "@/utils/time";
import { timestampToDateString } from "@/utils/date";
import { useAuth } from "@/contexts/auth-context";
import { SignInRequired } from "@/components/auth/sign-in-required";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const {
    tasks,
    now,
    loading,
    error,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleComplete,
    editTaskDetails,
    deleteTask,
  } = useTaskManager();
  const { user, loading: authLoading } = useAuth();
  const { collections, mapById } = useCollections();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueToday, setDueToday] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isComposerOpen, setComposerOpen] = useState(false);

  const task = useMemo(
    () => tasks.find((t) => t.id === taskId),
    [tasks, taskId]
  );

  const seconds = useMemo(
    () => (task ? getDisplaySeconds(task, now) : 0),
    [task, now]
  );

  const collection = useMemo(
    () => (task?.collectionId ? mapById.get(task.collectionId) : null),
    [task, mapById]
  );

  // Calculate time passed since task creation
  const timeSinceCreation = useMemo(() => {
    if (!task) return 0;
    return Math.floor((now - task.createdAt) / 1000);
  }, [task, now]);

  // Calculate time passed since first start
  const timeSinceFirstStart = useMemo(() => {
    if (!task?.firstStartedAt) return null;
    return Math.floor((now - task.firstStartedAt) / 1000);
  }, [task, now]);

  // Update form when task changes
  useEffect(() => {
    if (task) {
      // Use requestAnimationFrame to avoid synchronous setState in effect
      requestAnimationFrame(() => {
        setTitle(task.title);
        setDescription(task.description);
        setStartDate(timestampToDateString(task.startDate));
        setDueDate(timestampToDateString(task.dueDate));
        setDueToday(false);
        setSelectedCollectionId(task.collectionId);
      });
    }
  }, [task]);

  const resetForm = () => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStartDate(timestampToDateString(task.startDate));
      setDueDate(timestampToDateString(task.dueDate));
      setDueToday(false);
      setSelectedCollectionId(task.collectionId);
    }
    setEditingId(null);
    setFormError(null);
  };

  const closeComposer = () => {
    resetForm();
    setComposerOpen(false);
  };

  const handleEdit = () => {
    if (!task) return;
    setEditingId(task.id);
    setFormError(null);
    setComposerOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!task) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFormError("Please provide a task title before saving.");
      return;
    }

    setFormError(null);
    editTaskDetails(
      task.id,
      title,
      description,
      task.startDate,
      task.dueDate,
      selectedCollectionId
    );
    closeComposer();
  };

  const handleDelete = async () => {
    if (!task) return;
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task.id);
      router.push("/tasks");
    }
  };

  if (!user && !authLoading) {
    return (
      <div className="relative px-4 py-10 font-sans sm:px-6 lg:px-8">
        <SignInRequired
          title="Sign in to view task details"
          description="Please sign in to access task details and time tracking."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative px-4 py-10 font-sans sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[28px] border border-white/15 bg-white/10 p-10 text-center text-white backdrop-blur">
            <p className="text-lg font-semibold">Loading task…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="relative px-4 py-10 font-sans sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[28px] border border-rose-200/60 bg-rose-500/10 p-10 text-center text-rose-50 backdrop-blur">
            <p className="text-lg font-semibold">{error || "Task not found"}</p>
            <Link
              href="/tasks"
              className="mt-4 inline-block rounded-full border border-rose-50/40 px-5 py-2 text-sm font-semibold text-white transition hover:border-white"
            >
              Back to Tasks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const createdLabel = formatDateTime(task.createdAt);
  const startedLabel = formatDateTime(task.firstStartedAt);
  const finishedLabel = formatDateTime(task.completedAt);

  return (
    <div className="relative px-4 py-10 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center gap-4">
          <Link
            href="/tasks"
            className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white">Task Details</h1>
        </div>

        <div className="rounded-[28px] border border-white/20 bg-white/95 p-8 shadow-2xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-900">
                  {task.title}
                </h2>
                {task.description && (
                  <p className="mt-2 text-lg text-slate-600">
                    {task.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleComplete(task.id)}
                className={`flex h-12 w-12 items-center justify-center rounded-full border text-xl transition ${
                  task.completed
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-md"
                    : "border-slate-200 text-slate-400 hover:text-slate-600"
                }`}
                aria-label={
                  task.completed
                    ? "Mark task as incomplete"
                    : "Mark task as done"
                }
              >
                {task.completed ? "✓" : ""}
              </button>
            </div>

            {/* Main Clock Display with Selector */}
            <ClockSelector seconds={seconds} isRunning={task.running} />

            {/* Time Passed Clock */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-600">
                  Time Since Creation
                </p>
                <div className="mt-2 text-3xl font-bold text-slate-900">
                  {formatDuration(timeSinceCreation)}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Created: {createdLabel ?? "—"}
                </p>
              </div>
              {timeSinceFirstStart !== null && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold text-slate-600">
                    Time Since First Start
                  </p>
                  <div className="mt-2 text-3xl font-bold text-slate-900">
                    {formatDuration(timeSinceFirstStart)}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Started: {startedLabel ?? "—"}
                  </p>
                </div>
              )}
            </div>

            {/* Tags and Status */}
            <div className="flex flex-wrap items-center gap-2">
              {collection && (
                <span
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white"
                  style={{ background: collection.color ?? "#0f172a" }}
                >
                  {collection.name}
                </span>
              )}
              {task.running && (
                <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                  Running
                </span>
              )}
              {task.completed && (
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                  Completed
                </span>
              )}
            </div>

            {/* Task Info Grid */}
            <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-700">Created:</p>
                <p className="mt-1 text-base text-slate-600">
                  {createdLabel ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  First Started:
                </p>
                <p className="mt-1 text-base text-slate-600">
                  {startedLabel ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Completed:
                </p>
                <p className="mt-1 text-base text-slate-600">
                  {finishedLabel ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Last Updated:
                </p>
                <p className="mt-1 text-base text-slate-600">
                  {formatDateTime(task.updatedAt) ?? "—"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  if (task.running) {
                    pauseTimer(task.id);
                  } else {
                    startTimer(task.id);
                  }
                }}
                className={`rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow transition ${
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
                onClick={() => resetTimer(task.id)}
                disabled={task.elapsed === 0 && !task.running}
                className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition enabled:hover:border-slate-300 enabled:hover:text-slate-800 disabled:opacity-40"
              >
                Reset timer
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-2xl border border-transparent bg-slate-900/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <TaskComposerModal
        open={isComposerOpen}
        title={title}
        description={description}
        formError={formError}
        isEditing={Boolean(editingId)}
        startDate={startDate}
        dueDate={dueDate}
        dueToday={dueToday}
        collectionId={selectedCollectionId}
        collections={collections}
        onSubmit={handleSubmit}
        onClose={closeComposer}
        onCancelEdit={closeComposer}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onStartDateChange={setStartDate}
        onDueDateChange={setDueDate}
        onDueTodayChange={setDueToday}
        onCollectionChange={setSelectedCollectionId}
      />
    </div>
  );
}
