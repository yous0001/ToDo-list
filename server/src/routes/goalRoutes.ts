import { Router } from "express";
import { randomUUID } from "crypto";
import { WithId } from "mongodb";

import { getGoalsCollection } from "../db/client";
import { GoalDocument } from "../types/task";

const toResponse = (doc: WithId<GoalDocument> | GoalDocument) => {
  const { _id, ...rest } = doc as WithId<GoalDocument>;
  return rest;
};

const sanitizeString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const sanitizeNumber = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;

export const goalRouter = Router();

goalRouter.get("/", async (req, res) => {
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
});

goalRouter.post("/", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const title = sanitizeString(req.body?.title);
  const type = req.body?.type;
  const targetMinutes = sanitizeNumber(req.body?.targetMinutes, 0);

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
    const collection = await getGoalsCollection();
    const timestamp = Date.now();
    const goal: GoalDocument = {
      id: randomUUID(),
      userId,
      type,
      title,
      targetMinutes,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await collection.insertOne(goal);
    res.status(201).json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create goal" });
  }
});

goalRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

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

    const result = await collection.findOneAndUpdate(
      { id, userId },
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
});

goalRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const collection = await getGoalsCollection();
    const result = await collection.deleteOne({ id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete goal" });
  }
});


