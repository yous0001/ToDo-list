import { Request, Response } from "express";
import { ObjectId, WithId } from "mongodb";

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

const parseObjectId = (value: string) => {
  if (!ObjectId.isValid(value)) {
    return null;
  }
  return new ObjectId(value);
};

const toCollectionResponse = (
  doc: (WithId<CollectionDocument> | CollectionDocument) & { id?: string }
) => {
  const {
    _id,
    id: legacyId,
    ...rest
  } = doc as WithId<CollectionDocument> & {
    id?: string;
  };
  return {
    id: legacyId ?? _id.toHexString(),
    ...rest,
  };
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
    res.json(collections.map((doc) => toCollectionResponse(doc)));
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
      _id: new ObjectId(),
      userId,
      name,
      description,
      color,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await collection.insertOne(doc);
    res.status(201).json(toCollectionResponse(doc));
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
  const objectId = parseObjectId(id);

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

    const query = objectId ? { _id: objectId, userId } : { userId, id };

    const result = await collection.findOneAndUpdate(
      query,
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ error: "Collection not found" });
    }

    res.json(toCollectionResponse(result));
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
  const objectId = parseObjectId(id);

  try {
    const collection = await getCollectionsCollection();
    const deleteQuery = objectId ? { _id: objectId, userId } : { userId, id };
    const result = await collection.deleteOne(deleteQuery);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }
    const tasks = await getTasksCollection();
    const collectionIdString = objectId ? objectId.toHexString() : id;
    await tasks.updateMany(
      { userId, collectionId: { $in: [collectionIdString, id] } },
      { $set: { collectionId: null, updatedAt: Date.now() } }
    );
    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete collection", error);
    res.status(500).json({ error: "Failed to delete collection" });
  }
};
