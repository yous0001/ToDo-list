"use client";

import { FormEventHandler, MouseEvent } from "react";

type SimpleCollection = {
  id: string;
  name: string;
};

type TaskComposerModalProps = {
  open: boolean;
  title: string;
  description: string;
  formError: string | null;
  isEditing: boolean;
  startDate: string;
  dueDate: string;
  dueToday: boolean;
  collectionId: string | null;
  collections: SimpleCollection[];
  onSubmit: FormEventHandler<HTMLFormElement>;
  onClose: () => void;
  onCancelEdit: () => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onDueTodayChange: (value: boolean) => void;
  onCollectionChange: (value: string | null) => void;
};

export const TaskComposerModal = ({
  open,
  title,
  description,
  formError,
  isEditing,
  startDate,
  dueDate,
  dueToday,
  collectionId,
  collections,
  onSubmit,
  onClose,
  onCancelEdit,
  onTitleChange,
  onDescriptionChange,
  onStartDateChange,
  onDueDateChange,
  onDueTodayChange,
  onCollectionChange,
}: TaskComposerModalProps) => {
  if (!open) {
    return null;
  }

  const handleBackdropClick = () => {
    onClose();
  };

  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/70 px-3 py-6 sm:px-4 sm:py-10 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative mt-20 flex w-full max-w-2xl flex-col rounded-[32px] bg-white/95 p-5 shadow-2xl sm:mt-24 sm:p-8"
        style={{ maxHeight: "calc(100vh - 6rem)" }}
        onClick={handleContentClick}
      >
        <button
          type="button"
          className="absolute right-6 top-6 rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
          onClick={onClose}
          aria-label="Close composer"
        >
          ×
        </button>

        <div className="flex-1 overflow-y-auto pr-2 sm:pr-3">
          <div className="mb-6 space-y-2 pr-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              {isEditing ? "Update task" : "New task"}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {isEditing ? "Refine your plan" : "What will you focus on next?"}
            </h2>
            <p className="text-sm text-slate-500">
              Add a clear title and optional notes. Timers start directly from
              the task card once saved.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-5 pb-4">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              Task title
              <input
                type="text"
                value={title}
                onChange={(event) => onTitleChange(event.target.value)}
                placeholder="Plan sprint retro"
                maxLength={80}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              Description
              <textarea
                value={description}
                onChange={(event) => onDescriptionChange(event.target.value)}
                placeholder="Add acceptance criteria, links, or any helpful notes."
                maxLength={280}
                rows={4}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={dueToday}
                  onChange={(event) => onDueTodayChange(event.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-200"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Due today
                </span>
                <span className="text-xs text-slate-500">
                  (Quick set for tasks due end of today)
                </span>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                Start date (optional)
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => onStartDateChange(event.target.value)}
                  disabled={dueToday}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                Due date (optional)
                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => onDueDateChange(event.target.value)}
                  disabled={dueToday}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              Collection
              <select
                value={collectionId ?? ""}
                onChange={(event) =>
                  onCollectionChange(
                    event.target.value === "" ? null : event.target.value
                  )
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">No collection</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
              <span className="text-xs font-normal text-slate-500">
                Group tasks into long-running workflows for better tracking.
              </span>
            </label>

            {formError && (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {formError}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:opacity-95 sm:flex-none"
              >
                {isEditing ? "Save changes" : "Add task"}
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
                className="rounded-2xl border border-slate-300 px-6 py-3 text-base font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
