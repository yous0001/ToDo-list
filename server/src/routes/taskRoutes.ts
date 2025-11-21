import { Router } from "express";
import { randomUUID } from "crypto";
import { WithId } from "mongodb";

import { getTasksCollection } from "../db/client";
import { TaskDocument } from "../types/task";

const toResponse = (doc: WithId<TaskDocument> | TaskDocument) => {
  const { _id, ...rest } = doc as WithId<TaskDocument>;
  return {
    ...rest,
    firstStartedAt: rest.firstStartedAt ?? null,
    completedAt: rest.completedAt ?? null,
    dueDate: rest.dueDate ?? null,
    startDate: rest.startDate ?? null,
  };
};

const sanitizeTitle = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const sanitizeDescription = (value: unknown) =>
  typeof value === "string" ? value : "";

const sanitizeBoolean = (value: unknown, fallback = false) =>
  typeof value === "boolean" ? value : fallback;

const sanitizeNumber = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const sanitizeTimestamp = (value: unknown) => {
  if (value === null) {
    return null;
  }
  return typeof value === "number" && Number.isFinite(value) ? value : null;
};

export const taskRouter = Router();

taskRouter.get("/", async (_req, res) => {
  try {
    const collection = await getTasksCollection();
    const tasks = await collection.find().sort({ createdAt: -1 }).toArray();
    res.json(tasks.map(toResponse));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load tasks" });
  }
});

taskRouter.post("/", async (req, res) => {
  const title = sanitizeTitle(req.body?.title);
  const description = sanitizeDescription(req.body?.description ?? "");
  const dueDate = sanitizeTimestamp(req.body?.dueDate);
  const startDate = sanitizeTimestamp(req.body?.startDate);

  if (!title) {
    return res.status(400).json({ error: "Task title is required" });
  }

  try {
    const collection = await getTasksCollection();
    const timestamp = Date.now();
    const task: TaskDocument = {
      id: randomUUID(),
      title,
      description,
      completed: false,
      elapsed: 0,
      running: false,
      lastStartedAt: null,
      firstStartedAt: null,
      completedAt: null,
      dueDate,
      startDate,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await collection.insertOne(task);
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

taskRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const collection = await getTasksCollection();
    const now = Date.now();

    const updates: Partial<TaskDocument> = { updatedAt: now };
    const body = req.body ?? {};

    if ("title" in body && typeof body.title === "string") {
      const title = sanitizeTitle(body.title);
      if (!title) {
        return res.status(400).json({ error: "Task title cannot be empty" });
      }
      updates.title = title;
    }

    if ("description" in body && typeof body.description === "string") {
      updates.description = sanitizeDescription(body.description);
    }

    if ("completed" in body) {
      updates.completed = sanitizeBoolean(body.completed);
    }

    if ("elapsed" in body) {
      updates.elapsed = sanitizeNumber(body.elapsed);
    }

    if ("running" in body) {
      updates.running = sanitizeBoolean(body.running);
    }

    if ("lastStartedAt" in body) {
      updates.lastStartedAt = sanitizeTimestamp(body.lastStartedAt);
    }

    if ("firstStartedAt" in body) {
      updates.firstStartedAt = sanitizeTimestamp(body.firstStartedAt);
    }

    if ("completedAt" in body) {
      updates.completedAt = sanitizeTimestamp(body.completedAt);
    }

    if ("dueDate" in body) {
      updates.dueDate = sanitizeTimestamp(body.dueDate);
    }

    if ("startDate" in body) {
      updates.startDate = sanitizeTimestamp(body.startDate);
    }

    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(toResponse(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

taskRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const collection = await getTasksCollection();
    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});
