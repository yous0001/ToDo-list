import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { WithId } from "mongodb";

import { getTasksCollection, getCollectionsCollection } from "../db/client";
import { TaskDocument } from "../types/task";

const toResponse = (doc: WithId<TaskDocument> | TaskDocument) => {
  const { _id, ...rest } = doc as WithId<TaskDocument>;
  return {
    ...rest,
    firstStartedAt: rest.firstStartedAt ?? null,
    completedAt: rest.completedAt ?? null,
    dueDate: rest.dueDate ?? null,
    startDate: rest.startDate ?? null,
    collectionId: rest.collectionId ?? null,
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

const sanitizeCollectionId = (value: unknown) => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return null;
};

const validateCollectionOwnership = async (
  collectionId: string | null,
  userId: string
) => {
  if (!collectionId) {
    return true;
  }
  const collections = await getCollectionsCollection();
  const exists = await collections.findOne({ id: collectionId, userId });
  return Boolean(exists);
};

export const getTasks = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const collection = await getTasksCollection();
    const tasks = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(tasks.map(toResponse));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load tasks" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const title = sanitizeTitle(req.body?.title);
  const description = sanitizeDescription(req.body?.description ?? "");
  const dueDate = sanitizeTimestamp(req.body?.dueDate);
  const startDate = sanitizeTimestamp(req.body?.startDate);
  const collectionId = sanitizeCollectionId(req.body?.collectionId);

  if (!title) {
    return res.status(400).json({ error: "Task title is required" });
  }

  try {
    const collectionValid = await validateCollectionOwnership(
      collectionId,
      userId
    );
    if (!collectionValid) {
      return res.status(400).json({ error: "Invalid collection" });
    }

    const collection = await getTasksCollection();
    const timestamp = Date.now();
    const task: TaskDocument = {
      id: randomUUID(),
      userId,
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
      collectionId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await collection.insertOne(task);
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!id) {
    return res.status(400).json({ error: "Task id is required" });
  }
  const ownerId = userId;

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

    if ("collectionId" in body) {
      const newCollectionId = sanitizeCollectionId(body.collectionId);
      const valid = await validateCollectionOwnership(newCollectionId, ownerId);
      if (!valid) {
        return res.status(400).json({ error: "Invalid collection" });
      }
      updates.collectionId = newCollectionId;
    }

    const result = await collection.findOneAndUpdate(
      { id, userId: ownerId },
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
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!id) {
    return res.status(400).json({ error: "Task id is required" });
  }
  const ownerId = userId;

  try {
    const collection = await getTasksCollection();
    const result = await collection.deleteOne({ id, userId: ownerId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};


