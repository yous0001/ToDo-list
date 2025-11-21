"use client";

import { FormEvent, useMemo, useState } from "react";

import { TaskCard } from "@/components/task-card";
import { TaskComposerModal } from "@/components/task-composer-modal";
import { useTaskManager } from "@/hooks/use-task-manager";
import { Task } from "@/types/task";
import { getDisplaySeconds } from "@/utils/time";
import {
  dateStringToTimestamp,
  timestampToDateString,
  getEndOfToday,
} from "@/utils/date";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "running", label: "In progress" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const FILTER_PREDICATE: Record<FilterId, (task: Task) => boolean> = {
  all: () => true,
  active: (task) => !task.completed,
  completed: (task) => task.completed,
  running: (task) => task.running,
};

const SORT_OPTIONS = [
  { id: "recent", label: "Newest" },
  { id: "alpha", label: "A → Z" },
  { id: "elapsed", label: "Time spent" },
  { id: "dueDate", label: "Due date" },
] as const;

type SortOptionId = (typeof SORT_OPTIONS)[number]["id"];

export default function TasksPage() {
  const {
    tasks,
    summary,
    now,
    loading,
    error: taskError,
    refresh,
    addTask,
    editTaskDetails,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleComplete,
    deleteTask,
  } = useTaskManager();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueToday, setDueToday] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOptionId>("recent");
  const [bulkBusy, setBulkBusy] = useState(false);
  const [isComposerOpen, setComposerOpen] = useState(false);

  const tasksWithSeconds = useMemo(
    () =>
      tasks.map((task) => ({
        task,
        seconds: getDisplaySeconds(task, now),
      })),
    [tasks, now]
  );

  const filteredTasks = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return tasksWithSeconds.filter(({ task }) => {
      const matchesFilter = FILTER_PREDICATE[activeFilter](task);
      if (!matchesFilter) {
        return false;
      }
      if (!search) {
        return true;
      }
      return (
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search)
      );
    });
  }, [tasksWithSeconds, activeFilter, searchTerm]);

  const visibleTasks = useMemo(() => {
    const sorted = [...filteredTasks];
    switch (sortBy) {
      case "alpha":
        sorted.sort((a, b) => a.task.title.localeCompare(b.task.title));
        break;
      case "elapsed":
        sorted.sort((a, b) => b.seconds - a.seconds);
        break;
      case "dueDate":
        sorted.sort((a, b) => {
          if (!a.task.dueDate && !b.task.dueDate) return 0;
          if (!a.task.dueDate) return 1;
          if (!b.task.dueDate) return -1;
          return a.task.dueDate - b.task.dueDate;
        });
        break;
      default:
        sorted.sort((a, b) => b.task.createdAt - a.task.createdAt);
    }
    return sorted;
  }, [filteredTasks, sortBy]);

  const filterCounts: Record<FilterId, number> = {
    all: summary.total,
    active: Math.max(summary.total - summary.completed, 0),
    completed: summary.completed,
    running: summary.running,
  };

  const hasCompleted = summary.completed > 0;
  const showEmptyState = !loading && !taskError && visibleTasks.length === 0;
  const noTasks = summary.total === 0;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setDueDate("");
    setDueToday(false);
    setEditingId(null);
    setFormError(null);
  };

  const closeComposer = () => {
    resetForm();
    setComposerOpen(false);
  };

  const handleNewTask = () => {
    resetForm();
    setComposerOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setFormError("Please provide a task title before saving.");
      return;
    }

    setFormError(null);

    const finalDueDate = dueToday
      ? getEndOfToday()
      : dateStringToTimestamp(dueDate);
    const finalStartDate = dueToday ? null : dateStringToTimestamp(startDate);

    if (editingId) {
      editTaskDetails(
        editingId,
        title,
        description,
        finalStartDate,
        finalDueDate
      );
    } else {
      addTask(title, description, finalStartDate, finalDueDate);
    }

    closeComposer();
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setStartDate(timestampToDateString(task.startDate));
    setDueDate(timestampToDateString(task.dueDate));
    setDueToday(false);
    setEditingId(task.id);
    setFormError(null);
    setComposerOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    if (editingId === id) {
      closeComposer();
    }
  };

  const handleClearCompleted = async () => {
    if (!hasCompleted) {
      return;
    }
    setBulkBusy(true);
    try {
      const completedIds = tasks
        .filter((task) => task.completed)
        .map((task) => task.id);
      await Promise.all(completedIds.map((taskId) => deleteTask(taskId)));
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div className="relative px-4 py-10 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="text-center text-white">
          <p className="text-sm uppercase tracking-[0.4em] text-white/80">
            Task cockpit
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Task Manager
          </h1>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            Track all your tasks with timers, precise schedules, and rich
            descriptions.
          </p>
        </header>

        <section className="rounded-[28px] border border-white/15 bg-white/10 p-6 text-white shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter.id
                      ? "border-transparent bg-slate-900 text-white shadow-lg"
                      : "border-white/30 bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-normal text-white/80">
                    {filterCounts[filter.id]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search tasks"
                  className="w-full rounded-2xl border border-white/40 bg-white/90 px-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs uppercase tracking-[0.4em] text-slate-400">
                  SEARCH
                </span>
              </div>
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOptionId)
                }
                className="rounded-2xl border border-white/40 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    Sort: {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={refresh}
              className="rounded-2xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Refresh data
            </button>
            <button
              type="button"
              onClick={handleClearCompleted}
              disabled={!hasCompleted || bulkBusy}
              className="rounded-2xl border border-transparent bg-rose-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
            >
              {bulkBusy ? "Clearing…" : "Clear completed"}
            </button>
          </div>
        </section>

        <section className="space-y-4">
          {loading ? (
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-10 text-center text-white backdrop-blur">
              <p className="text-lg font-semibold">Loading tasks…</p>
              <p className="mt-2 text-sm text-white/80">
                Fetching the latest tasks from the API.
              </p>
            </div>
          ) : taskError ? (
            <div className="rounded-[28px] border border-rose-200/60 bg-rose-500/10 p-10 text-center text-rose-50 backdrop-blur">
              <p className="text-lg font-semibold">
                Unable to reach the backend
              </p>
              <p className="mt-2 text-sm text-rose-100">{taskError}</p>
              <button
                type="button"
                onClick={refresh}
                className="mt-4 rounded-full border border-rose-50/40 px-5 py-2 text-sm font-semibold text-white transition hover:border-white"
              >
                Retry
              </button>
            </div>
          ) : showEmptyState ? (
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-10 text-center text-white backdrop-blur">
              <p className="text-lg font-semibold">
                {noTasks ? "No tasks yet" : "No tasks match your filters"}
              </p>
              <p className="mt-2 text-sm text-white/80">
                {noTasks
                  ? "Add your first task to start timing your productive sessions."
                  : "Try adjusting filters, clearing the search, or refreshing the data."}
              </p>
            </div>
          ) : (
            <ul className="space-y-5">
              {visibleTasks.map(({ task, seconds }) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  seconds={seconds}
                  onToggleComplete={toggleComplete}
                  onStart={startTimer}
                  onPause={pauseTimer}
                  onReset={resetTimer}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </section>
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
        onSubmit={handleSubmit}
        onClose={closeComposer}
        onCancelEdit={closeComposer}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onStartDateChange={setStartDate}
        onDueDateChange={setDueDate}
        onDueTodayChange={setDueToday}
      />

      <button
        type="button"
        onClick={handleNewTask}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-3xl font-bold text-white shadow-2xl transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Add task"
      >
        +
      </button>
    </div>
  );
}


