"use client";

import { FormEvent, useMemo, useState } from "react";

import { useCollections } from "@/hooks/use-collections";
import { useTaskManager } from "@/hooks/use-task-manager";
import { useAuth } from "@/contexts/auth-context";
import { SignInRequired } from "@/components/auth/sign-in-required";
import { Collection } from "@/types/task";
import { formatDuration, getDisplaySeconds } from "@/utils/time";

const TIMEFRAME_OPTIONS = [
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "year", label: "This year" },
  { id: "all", label: "All time" },
] as const;

type TimeframeId = (typeof TIMEFRAME_OPTIONS)[number]["id"];

const timeframeStart = (timeframe: TimeframeId) => {
  const now = new Date();
  switch (timeframe) {
    case "week": {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const start = new Date(now.setDate(diff));
      start.setHours(0, 0, 0, 0);
      return start.getTime();
    }
    case "month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      return start.getTime();
    }
    case "year": {
      const start = new Date(now.getFullYear(), 0, 1);
      start.setHours(0, 0, 0, 0);
      return start.getTime();
    }
    default:
      return null;
  }
};

const randomPalette = () => {
  const palettes = [
    "#4f46e5",
    "#ec4899",
    "#0ea5e9",
    "#10b981",
    "#f97316",
    "#a855f7",
  ];
  return palettes[Math.floor(Math.random() * palettes.length)];
};

export default function CollectionsPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    collections,
    loading: collectionsLoading,
    error: collectionsError,
    createCollection,
    updateCollection,
    deleteCollection,
  } = useCollections();
  const { tasks, now } = useTaskManager();

  const [timeframe, setTimeframe] = useState<TimeframeId>("all");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formColor, setFormColor] = useState(randomPalette());
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const tasksWithSeconds = useMemo(
    () =>
      tasks.map((task) => ({
        task,
        seconds: getDisplaySeconds(task, now),
      })),
    [tasks, now]
  );

  const filteredStart = timeframeStart(timeframe);

  const collectionsWithStats = useMemo(() => {
    return collections.map((collection) => {
      const assigned = tasksWithSeconds.filter(
        ({ task }) => task.collectionId === collection.id
      );

      const inWindow = assigned.filter(({ task }) => {
        if (!filteredStart) {
          return true;
        }
        const reference =
          task.completedAt ?? task.firstStartedAt ?? task.createdAt;
        return reference >= filteredStart;
      });

      const focusSeconds = inWindow.reduce(
        (total, entry) => total + entry.seconds,
        0
      );

      const completed = inWindow.filter(({ task }) => task.completed).length;
      const total = inWindow.length;
      const percent =
        total === 0 ? 0 : Math.round(Math.min((completed / total) * 100, 100));

      return {
        collection,
        assigned,
        stats: {
          total,
          completed,
          focusSeconds,
          percent,
          running: inWindow.filter(({ task }) => task.running).length,
        },
      };
    });
  }, [collections, tasksWithSeconds, filteredStart]);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormColor(randomPalette());
    setFormError(null);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = formName.trim();
    if (!trimmed) {
      setFormError("Collection name is required.");
      return;
    }
    setBusy(true);
    try {
      if (editingId) {
        await updateCollection(editingId, {
          name: trimmed,
          description: formDescription.trim(),
          color: formColor,
        });
      } else {
        await createCollection({
          name: trimmed,
          description: formDescription.trim(),
          color: formColor,
        });
      }
      resetForm();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to save collection."
      );
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (collection: Collection) => {
    setFormName(collection.name);
    setFormDescription(collection.description);
    setFormColor(collection.color ?? randomPalette());
    setEditingId(collection.id);
    setFormError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection? Tasks will remain ungrouped.")) {
      return;
    }
    try {
      await deleteCollection(id);
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to delete collection."
      );
    }
  };

  if (!user && !authLoading) {
    return (
      <div className="relative px-4 py-10 font-sans sm:px-6 lg:px-8">
        <SignInRequired
          title="Sign in to manage collections"
          description="Group tasks into strategic roadmaps and track their progress."
        />
      </div>
    );
  }

  return (
    <div className="relative px-4 py-10 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="text-center text-white">
          <p className="text-sm uppercase tracking-[0.4em] text-white/80">
            Strategic grouping
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Collections
          </h1>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            Organize your tasks into journeys, track their focus time, and see
            how each initiative is moving.
          </p>
        </header>

        <section className="rounded-[28px] border border-white/15 bg-white/10 p-6 text-white shadow-2xl backdrop-blur">
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-[24px] border border-white/15 bg-white/10 p-5 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                {editingId ? "Edit collection" : "Create a collection"}
              </p>
            </div>
            <label className="flex flex-col gap-2 text-sm font-semibold text-white/90">
              Name
              <input
                type="text"
                value={formName}
                onChange={(event) => setFormName(event.target.value)}
                maxLength={40}
                placeholder="Productivity roadmap"
                className="rounded-2xl border border-white/30 bg-white/90 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-white/90">
              Accent color
              <input
                type="color"
                value={formColor}
                onChange={(event) => setFormColor(event.target.value)}
                className="h-12 w-full rounded-2xl border border-white/30 bg-white/90 p-1"
              />
            </label>
            <label className="sm:col-span-2 flex flex-col gap-2 text-sm font-semibold text-white/90">
              Description
              <textarea
                value={formDescription}
                onChange={(event) => setFormDescription(event.target.value)}
                placeholder="What does this collection represent?"
                rows={3}
                className="rounded-2xl border border-white/30 bg-white/90 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </label>
            {formError && (
              <p className="sm:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {formError}
              </p>
            )}
            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={busy}
                className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition disabled:opacity-60"
              >
                {editingId
                  ? busy
                    ? "Saving..."
                    : "Save changes"
                  : busy
                  ? "Creating..."
                  : "Create collection"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-white/30 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/60 hover:text-white"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-[28px] border border-white/15 bg-white/95 p-6 shadow-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Progress lens
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">
                Track collections
              </h2>
              <p className="text-sm text-slate-500">
                Choose a timeframe to see how each collection progresses.
              </p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-100/70 p-1">
              <div className="flex flex-wrap gap-1">
                {TIMEFRAME_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTimeframe(option.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      timeframe === option.id
                        ? "bg-white text-slate-900 shadow"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {collectionsError && (
            <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {collectionsError}
            </p>
          )}

          {collectionsLoading ? (
            <div className="mt-8 rounded-[28px] border border-white/20 bg-white/10 p-10 text-center text-white backdrop-blur">
              <p className="text-lg font-semibold">Loading collections…</p>
            </div>
          ) : collectionsWithStats.length === 0 ? (
            <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-10 text-center text-slate-500">
              Create your first collection to group related tasks.
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {collectionsWithStats.map(({ collection, assigned, stats }) => (
                <article
                  key={collection.id}
                  className="rounded-[26px] border border-slate-200 bg-white/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <header className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                        {assigned.length} tasks
                      </p>
                      <h3 className="text-2xl font-semibold text-slate-900">
                        {collection.name}
                      </h3>
                      {collection.description && (
                        <p className="text-sm text-slate-500">
                          {collection.description}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(collection.id)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
                    >
                      Delete
                    </button>
                  </header>

                  <div className="mt-4 flex items-center gap-6">
                    <div className="relative h-24 w-24">
                      <svg viewBox="0 0 100 100" className="-rotate-90">
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#e2e8f0"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke={collection.color}
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 38}
                          strokeDashoffset={
                            2 * Math.PI * 38 - (stats.percent / 100) * (2 * Math.PI * 38)
                          }
                          fill="none"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-slate-900">
                        {stats.percent}%
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 text-sm text-slate-600">
                      <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-3 py-2">
                        <span>Focus</span>
                        <span className="font-semibold text-slate-900">
                          {formatDuration(stats.focusSeconds)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-emerald-800">
                        <span>Completed</span>
                        <span className="font-semibold">{stats.completed}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-amber-800">
                        <span>Running</span>
                        <span className="font-semibold">{stats.running}</span>
                      </div>
                    </div>
                  </div>

                  <footer className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => startEdit(collection)}
                      className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                    >
                      Edit
                    </button>
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                      {assigned.filter(({ task }) => task.completed).length} /{" "}
                      {assigned.length} completed
                    </span>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


