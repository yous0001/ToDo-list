import { ObjectId } from "mongodb";

export type TaskDocument = {
  _id: ObjectId;
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

export type GoalStatus = "pending" | "achieved" | "failed";

export type GoalDocument = {
  _id: ObjectId;
  userId: string;
  type: "daily" | "weekly" | "monthly";
  title: string;
  targetMinutes: number; // Target time in minutes
  collectionId: string | null;
  status: GoalStatus;
  completedAt: number | null;
  createdAt: number;
  updatedAt: number;
};

export type CollectionDocument = {
  _id: ObjectId;
  userId: string;
  name: string;
  description: string;
  color: string;
  createdAt: number;
  updatedAt: number;
};
