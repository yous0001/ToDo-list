export type Task = {
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

export type Collection = {
  id: string;
  userId: string;
  name: string;
  description: string;
  color: string;
  createdAt: number;
  updatedAt: number;
};

export type GoalStatus = "pending" | "achieved" | "failed";

export type Goal = {
  id: string;
  userId: string;
  title: string;
  type: "daily" | "weekly" | "monthly";
  targetMinutes: number;
  collectionId: string | null;
  status: GoalStatus;
  completedAt: number | null;
  createdAt: number;
  updatedAt: number;
};
