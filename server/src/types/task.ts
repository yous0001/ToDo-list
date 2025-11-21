export type TaskDocument = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  elapsed: number;
  running: boolean;
  lastStartedAt: number | null;
  firstStartedAt: number | null;
  completedAt: number | null;
  createdAt: number;
  updatedAt: number;
  dueDate: number | null; // Due date timestamp
  startDate: number | null; // When user wants to start working on task
};

export type Goal = {
  id: string;
  type: "daily" | "weekly" | "monthly";
  title: string;
  targetMinutes: number; // Target time in minutes
  createdAt: number;
  updatedAt: number;
};

export type GoalDocument = Goal;
