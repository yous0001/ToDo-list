export type TaskDocument = {
  id: string;
  userId: string;
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
  collectionId: string | null;
};

export type Goal = {
  id: string;
  userId: string;
  type: "daily" | "weekly" | "monthly";
  title: string;
  targetMinutes: number; // Target time in minutes
  createdAt: number;
  updatedAt: number;
};

export type GoalDocument = Goal;

export type CollectionDocument = {
  id: string;
  userId: string;
  name: string;
  description: string;
  color: string;
  createdAt: number;
  updatedAt: number;
};
