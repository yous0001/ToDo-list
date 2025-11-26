import { Task } from "@/types/task";

export const nowMs = () => Date.now();

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const dayLabelFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
});

export const formatDuration = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = Math.floor(safeSeconds % 60); // Ensure integer

  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const formatDateTime = (
  timestamp?: number | null,
  options?: Intl.DateTimeFormatOptions
) => {
  if (!timestamp) {
    return null;
  }
  if (options) {
    return new Intl.DateTimeFormat(undefined, options).format(
      new Date(timestamp)
    );
  }
  return dateTimeFormatter.format(new Date(timestamp));
};

export const formatDateStamp = (timestamp?: number | null) => {
  if (!timestamp) {
    return null;
  }
  return dateFormatter.format(new Date(timestamp));
};

export const formatDayLabel = (timestamp: number) => {
  return dayLabelFormatter.format(new Date(timestamp));
};

export const DAY_IN_MS = 86_400_000;

export const startOfDay = (timestamp: number) => {
  const day = new Date(timestamp);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
};

export const startOfToday = () => startOfDay(Date.now());

export const startOfWeek = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = date.getDay(); // 0 (Sunday) - 6 (Saturday)
  const diff = (day + 6) % 7; // convert to Monday-based week
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const getDisplaySeconds = (task: Task, now: number) => {
  let seconds = task.elapsed;
  if (task.running && task.lastStartedAt) {
    seconds += (now - task.lastStartedAt) / 1000;
  }
  return Math.max(0, seconds);
};
