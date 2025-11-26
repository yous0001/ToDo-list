import { Request, Response } from "express";
import { ObjectId, WithId } from "mongodb";

import { getGoalsCollection, getCollectionsCollection } from "../db/client";
import { GoalDocument, GoalStatus } from "../types/task";

const toResponse = (doc: WithId<GoalDocument> | GoalDocument) => {
  const { _id, ...rest } = doc as WithId<GoalDocument>;
  return {
    id: _id.toHexString(),
    ...rest,
    collectionId: rest.collectionId ?? null,
    status: (rest.status ?? "pending") as GoalStatus,
    completedAt: rest.completedAt ?? null,
  };
};

const parseObjectId = (value: string) => {
  if (!ObjectId.isValid(value)) {
    return null;
  }
  return new ObjectId(value);
};

const sanitizeString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const sanitizeNumber = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;

const sanitizeCollectionId = (value: unknown) => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return null;
};

const isValidGoalStatus = (value: unknown): value is GoalStatus =>
  value === "pending" || value === "achieved" || value === "failed";

const validateCollectionOwnership = async (
  collectionId: string | null,
  userId: string
) => {
  if (!collectionId) {
    return true;
  }
  const collections = await getCollectionsCollection();
  const objectId = parseObjectId(collectionId);
  if (!objectId) {
    return false;
  }
  const exists = await collections.findOne({
    _id: objectId,
    userId,
  });
  return Boolean(exists);
};

export const getGoals = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const collection = await getGoalsCollection();
    const goals = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(goals.map(toResponse));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load goals" });
  }
};

export const createGoal = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const title = sanitizeString(req.body?.title);
  const type = req.body?.type;
  const targetMinutes = sanitizeNumber(req.body?.targetMinutes, 0);
  const collectionId = sanitizeCollectionId(req.body?.collectionId);

  if (!title) {
    return res.status(400).json({ error: "Goal title is required" });
  }

  if (!["daily", "weekly", "monthly"].includes(type)) {
    return res
      .status(400)
      .json({ error: "Goal type must be daily, weekly, or monthly" });
  }

  if (targetMinutes <= 0) {
    return res
      .status(400)
      .json({ error: "Target minutes must be greater than 0" });
  }

  try {
    const ownsCollection = await validateCollectionOwnership(
      collectionId,
      userId
    );
    if (!ownsCollection) {
      return res.status(400).json({ error: "Invalid collection" });
    }

    const collection = await getGoalsCollection();
    const timestamp = Date.now();
    const goal: GoalDocument = {
      _id: new ObjectId(),
      userId,
      type,
      title,
      targetMinutes,
      collectionId,
      status: "pending",
      completedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await collection.insertOne(goal);
    res.status(201).json(toResponse(goal));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create goal" });
  }
};

export const updateGoal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!id) {
    return res.status(400).json({ error: "Goal id is required" });
  }
  const goalObjectId = parseObjectId(id);
  if (!goalObjectId) {
    return res.status(400).json({ error: "Invalid goal id" });
  }
  const ownerId = userId;

  try {
    const collection = await getGoalsCollection();
    const now = Date.now();

    const updates: Partial<GoalDocument> = { updatedAt: now };
    const body = req.body ?? {};

    if ("title" in body && typeof body.title === "string") {
      const title = sanitizeString(body.title);
      if (!title) {
        return res.status(400).json({ error: "Goal title cannot be empty" });
      }
      updates.title = title;
    }

    if ("targetMinutes" in body) {
      const targetMinutes = sanitizeNumber(body.targetMinutes, 0);
      if (targetMinutes <= 0) {
        return res
          .status(400)
          .json({ error: "Target minutes must be greater than 0" });
      }
      updates.targetMinutes = targetMinutes;
    }

    if ("type" in body) {
      if (!["daily", "weekly", "monthly"].includes(body.type)) {
        return res
          .status(400)
          .json({ error: "Goal type must be daily, weekly, or monthly" });
      }
      updates.type = body.type;
    }

    if ("collectionId" in body) {
      const collectionId = sanitizeCollectionId(body.collectionId);
      const ownsCollection = await validateCollectionOwnership(
        collectionId,
        ownerId
      );
      if (!ownsCollection) {
        return res.status(400).json({ error: "Invalid collection" });
      }
      updates.collectionId = collectionId;
    }

    if ("status" in body) {
      if (!isValidGoalStatus(body.status)) {
        return res
          .status(400)
          .json({ error: "Goal status must be pending, achieved, or failed" });
      }
      updates.status = body.status;
      updates.completedAt =
        body.status === "pending" ? null : Math.max(now, 0);
    }

    const result = await collection.findOneAndUpdate(
      { _id: goalObjectId, userId: ownerId },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json(toResponse(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update goal" });
  }
};

export const deleteGoal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!id) {
    return res.status(400).json({ error: "Goal id is required" });
  }
  const goalObjectId = parseObjectId(id);
  if (!goalObjectId) {
    return res.status(400).json({ error: "Invalid goal id" });
  }
  const ownerId = userId;

  try {
    const collection = await getGoalsCollection();
    const result = await collection.deleteOne({
      _id: goalObjectId,
      userId: ownerId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete goal" });
  }
};


