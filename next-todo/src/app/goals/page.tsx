"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

import { useGoals } from "@/hooks/use-goals";
import { useTaskManager } from "@/hooks/use-task-manager";
import { useCollections } from "@/hooks/use-collections";
import { formatDuration, getDisplaySeconds } from "@/utils/time";
import { Goal, GoalStatus } from "@/types/task";
import { useAuth } from "@/contexts/auth-context";
import { SignInRequired } from "@/components/auth/sign-in-required";

const GOAL_TYPE_OPTIONS: { id: Goal["type"]; label: string; copy: string }[] = [
  { id: "daily", label: "Today", copy: "Focus goals for today" },
  { id: "weekly", label: "This week", copy: "Sustain your weekly momentum" },
  { id: "monthly", label: "This month", copy: "Stay on track this month" },
];

const STATUS_META: Record<
  GoalStatus,
  { label: string; badge: string; beam: string }
> = {
  pending: {
    label: "In progress",
    badge: "bg-slate-100 text-slate-700",
    beam: "bg-slate-400",
  },
  achieved: {
    label: "Achieved",
    badge: "bg-emerald-100 text-emerald-700",
    beam: "bg-emerald-500",
  },
  failed: {
    label: "Missed",
    badge: "bg-rose-100 text-rose-700",
    beam: "bg-rose-500",
  },
};

const typeLabel = (type: Goal["type"]) => {
  switch (type) {
    case "daily":
      return "Today's objective";
    case "weekly":
      return "Weekly commitment";
    case "monthly":
    default:
      return "Monthly milestone";
  }
};

const timeframeStart = (type: Goal["type"], referenceMs: number) => {
  const current = new Date(referenceMs);
  if (type === "daily") {
    const start = new Date(
      current.getFullYear(),
      current.getMonth(),
      current.getDate()
    );
    start.setHours(0, 0, 0, 0);
    return start.getTime();
  }
  if (type === "weekly") {
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(current);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start.getTime();
  }
  const start = new Date(current.getFullYear(), current.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  return start.getTime();
};

type GoalFormState = {
  title: string;
  type: Goal["type"];
  targetHours: number;
  collectionId: string;
};

const defaultFormState: GoalFormState = {
  title: "",
  type: "daily",
  targetHours: 2,
  collectionId: "",
};

export default function GoalsPage() {
  const { user, loading: authLoading } = useAuth();
  const { goals, loading, error, createGoal, updateGoal, deleteGoal } =
    useGoals();
  const { tasks, now } = useTaskManager();
  const { collections, mapById } = useCollections();

  const [form, setForm] = useState<GoalFormState>(defaultFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [mutatingGoalId, setMutatingGoalId] = useState<string | null>(null);

  const tasksWithSeconds = useMemo(
    () =>
      tasks.map((task) => ({
        task,
        seconds: getDisplaySeconds(task, now),
        reference: task.completedAt ?? task.firstStartedAt ?? task.createdAt,
      })),
    [tasks, now]
  );

  const goalsWithProgress = useMemo(() => {
    return goals.map((goal) => {
      const windowStart = timeframeStart(goal.type, now);
      const focusSeconds = tasksWithSeconds
        .filter(({ task, reference }) => {
          if (goal.collectionId && task.collectionId !== goal.collectionId) {
            return false;
          }
          if (!reference) {
            return false;
          }
          return reference >= windowStart;
        })
        .reduce((total, entry) => total + entry.seconds, 0);

      const focusMinutes = Math.floor(focusSeconds / 60);
      const completion =
        goal.targetMinutes > 0
          ? Math.min(focusMinutes / goal.targetMinutes, 1)
          : 0;

      return {
        ...goal,
        focusSeconds,
        focusMinutes,
        completion,
      };
    });
  }, [goals, now, tasksWithSeconds]);

  const handleInputChange = (
    field: keyof GoalFormState,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const resetForm = () => {
    setForm(defaultFormState);
    setFormError(null);
  };

  const handleCreateGoal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = form.title.trim();
    if (!trimmed) {
      setFormError("Goal title is required.");
      return;
    }
    if (form.targetHours <= 0) {
      setFormError("Target hours must be greater than 0.");
      return;
    }
    setCreating(true);
    try {
      await createGoal({
        title: trimmed,
        type: form.type,
        targetMinutes: Math.round(form.targetHours * 60),
        collectionId: form.collectionId ? form.collectionId : null,
      });
      resetForm();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to create goal."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (goal: Goal, status: GoalStatus) => {
    setMutatingGoalId(goal.id);
    try {
      await updateGoal(goal.id, { status });
    } finally {
      setMutatingGoalId(null);
    }
  };

  const handleDeleteGoal = async (goal: Goal) => {
    if (
      !confirm(
        `Delete goal "${goal.title}"? Your progress history for this goal will be removed.`
      )
    ) {
      return;
    }
    setMutatingGoalId(goal.id);
    try {
      await deleteGoal(goal.id);
    } finally {
      setMutatingGoalId(null);
    }
  };

  if (!user && !authLoading) {
    return (
      <div className="relative px-4 py-10 sm:px-6 lg:px-8">
        <SignInRequired
          title="Sign in to set focus goals"
          description="Track your study streaks and hold yourself accountable."
        />
      </div>
    );
  }

  return (
    <div className="relative px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
            Focus compass
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Goals
          </h1>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            Define clear study targets for today, this week, or the month and
            keep score across your collections.
          </p>
        </header>

        <section className="rounded-[28px] border border-white/15 bg-white/10 p-6 text-white shadow-2xl backdrop-blur">
          <form
            onSubmit={handleCreateGoal}
            className="grid gap-4 rounded-[24px] border border-white/15 bg-white/10 p-5 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                Create a goal
              </p>
            </div>
            <label className="flex flex-col gap-2 text-sm font-semibold text-white/90">
              Title
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  handleInputChange("title", event.target.value)
                }
                placeholder="Study NestJS for 6 hours"
                className="rounded-2xl border border-white/30 bg-white/90 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                maxLength={80}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-white/90">
              Target hours
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={form.targetHours}
                onChange={(event) =>
                  handleInputChange("targetHours", Number(event.target.value))
                }
                className="rounded-2xl border border-white/30 bg-white/90 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </label>
            <div className="flex flex-col gap-2 text-sm font-semibold text-white/90">
              Timeframe
              <div className="flex gap-2 rounded-2xl border border-white/20 bg-white/5 p-1">
                {GOAL_TYPE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleInputChange("type", option.id)}
                    className={`flex-1 rounded-2xl px-3 py-2 text-xs uppercase tracking-wide transition ${
                      form.type === option.id
                        ? "bg-white text-slate-900 shadow"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex flex-col gap-2 text-sm font-semibold text-white/90">
              Collection (optional)
              <select
                value={form.collectionId}
                onChange={(event) =>
                  handleInputChange("collectionId", event.target.value)
                }
                className="rounded-2xl border border-white/30 bg-white/90 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">All collections</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </label>
            {formError && (
              <p className="sm:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {formError}
              </p>
            )}
            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={creating}
                className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create goal"}
              </button>
              {collections.length === 0 && (
                <span className="text-xs text-white/70">
                  Tip:{" "}
                  <Link
                    href="/collections"
                    className="font-semibold text-white underline decoration-dotted"
                  >
                    create a collection
                  </Link>{" "}
                  to target a study track.
                </span>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-[28px] border border-white/15 bg-white/95 p-6 shadow-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Live scorecard
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">
                Track your focus goals
              </h2>
              <p className="text-sm text-slate-500">
                Progress auto-updates from your task timers. Mark a goal achieved
                once you reach the target or flag it as missed.
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </p>
          )}

          {loading ? (
            <div className="mt-8 rounded-[28px] border border-white/20 bg-white/10 p-10 text-center text-slate-500">
              Loading goals…
            </div>
          ) : goalsWithProgress.length === 0 ? (
            <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-10 text-center text-slate-500">
              No goals yet. Create a target to keep your study streak alive.
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {goalsWithProgress.map((goal) => {
                const collection = goal.collectionId
                  ? mapById.get(goal.collectionId)
                  : null;
                const statusMeta = STATUS_META[goal.status];
                const targetSeconds = goal.targetMinutes * 60;
                return (
                  <article
                    key={goal.id}
                    className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <header className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                          {typeLabel(goal.type)}
                        </p>
                        <h3 className="text-2xl font-semibold text-slate-900">
                          {goal.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Target {formatDuration(targetSeconds)}
                          {collection ? ` · ${collection.name}` : ""}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badge}`}
                      >
                        {statusMeta.label}
                      </span>
                    </header>

                    {collection && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                        {collection.name}
                      </div>
                    )}

                    <div className="mt-4 space-y-3">
                      <div className="flex items-baseline justify-between text-slate-600">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                            Focus logged
                          </p>
                          <p className="text-xl font-semibold text-slate-900">
                            {formatDuration(goal.focusSeconds)}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                          Goal: {formatDuration(targetSeconds)}
                        </p>
                      </div>
                      <div className="relative h-3 rounded-full bg-slate-100">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all"
                          style={{ width: `${goal.completion * 100}%` }}
                        />
                      </div>
                    </div>

                    <footer className="mt-5 flex flex-wrap gap-2 text-xs text-slate-500">
                      {goal.status !== "achieved" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(goal, "achieved")}
                          className="rounded-full border border-emerald-200 px-3 py-1 font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60"
                          disabled={mutatingGoalId === goal.id}
                        >
                          Mark as achieved
                        </button>
                      )}
                      {goal.status !== "failed" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(goal, "failed")}
                          className="rounded-full border border-rose-200 px-3 py-1 font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                          disabled={mutatingGoalId === goal.id}
                        >
                          Mark as failed
                        </button>
                      )}
                      {goal.status !== "pending" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(goal, "pending")}
                          className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-60"
                          disabled={mutatingGoalId === goal.id}
                        >
                          Reset status
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteGoal(goal)}
                        className="rounded-full border border-transparent bg-slate-900/90 px-3 py-1 font-semibold text-white transition hover:bg-slate-900 disabled:opacity-60"
                        disabled={mutatingGoalId === goal.id}
                      >
                        Delete
                      </button>
                    </footer>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}




