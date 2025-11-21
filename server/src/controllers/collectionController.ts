import { Request, Response } from "express";
import { randomUUID } from "crypto";

import { getCollectionsCollection, getTasksCollection } from "../db/client";
import { CollectionDocument } from "../types/task";

const sanitizeName = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const sanitizeDescription = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const sanitizeColor = (value: unknown) => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return "#4f46e5";
};

export const listCollections = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const collection = await getCollectionsCollection();
    const collections = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(collections);
  } catch (error) {
    console.error("Failed to load collections", error);
    res.status(500).json({ error: "Failed to load collections" });
  }
};

export const createCollection = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const name = sanitizeName(req.body?.name);
  const description = sanitizeDescription(req.body?.description ?? "");
  const color = sanitizeColor(req.body?.color);

  if (!name) {
    return res.status(400).json({ error: "Collection name is required" });
  }

  try {
    const collection = await getCollectionsCollection();
    const timestamp = Date.now();
    const doc: CollectionDocument = {
      id: randomUUID(),
      userId,
      name,
      description,
      color,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await collection.insertOne(doc);
    res.status(201).json(doc);
  } catch (error) {
    console.error("Failed to create collection", error);
    res.status(500).json({ error: "Failed to create collection" });
  }
};

export const updateCollection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!id) {
    return res.status(400).json({ error: "Collection id is required" });
  }

  try {
    const collection = await getCollectionsCollection();
    const updates: Partial<CollectionDocument> = { updatedAt: Date.now() };
    const body = req.body ?? {};

    if ("name" in body) {
      const name = sanitizeName(body.name);
      if (!name) {
        return res.status(400).json({ error: "Collection name is required" });
      }
      updates.name = name;
    }

    if ("description" in body) {
      updates.description = sanitizeDescription(body.description);
    }

    if ("color" in body) {
      updates.color = sanitizeColor(body.color);
    }

    const result = await collection.findOneAndUpdate(
      { id, userId },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ error: "Collection not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Failed to update collection", error);
    res.status(500).json({ error: "Failed to update collection" });
  }
};

export const deleteCollection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!id) {
    return res.status(400).json({ error: "Collection id is required" });
  }

  try {
    const collection = await getCollectionsCollection();
    const result = await collection.deleteOne({ id, userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }
    const tasks = await getTasksCollection();
    await tasks.updateMany(
      { userId, collectionId: id },
      { $set: { collectionId: null, updatedAt: Date.now() } }
    );
    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete collection", error);
    res.status(500).json({ error: "Failed to delete collection" });
  }
};

