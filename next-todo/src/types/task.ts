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
};
