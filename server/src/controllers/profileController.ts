import { Request, Response } from "express";
import { ObjectId } from "mongodb";

import {
  getGoalsCollection,
  getTasksCollection,
  getUsersCollection,
} from "../db/client";
import { ProfileStats, UserDocument, UserProfileResponse } from "../types/user";
import { uploadImageBuffer, deleteImage } from "../lib/cloudinary";
import { env } from "../config/env";

const parseObjectId = (value: string) => {
  if (!ObjectId.isValid(value)) {
    return null;
  }
  return new ObjectId(value);
};

const buildStats = async (userId: string): Promise<ProfileStats> => {
  const tasksCollection = await getTasksCollection();
  const goalsCollection = await getGoalsCollection();

  const [
    totalTasks,
    completedTasks,
    elapsedSummary,
    goalsAchieved,
    goalsActive,
  ] = await Promise.all([
    tasksCollection.countDocuments({ userId }),
    tasksCollection.countDocuments({ userId, completed: true }),
    tasksCollection
      .aggregate<{ _id: null; totalElapsed: number }>([
        { $match: { userId } },
        { $group: { _id: null, totalElapsed: { $sum: "$elapsed" } } },
      ])
      .toArray(),
    goalsCollection.countDocuments({ userId, status: "achieved" }),
    goalsCollection.countDocuments({ userId, status: { $in: ["pending"] } }),
  ]);

  const totalElapsedSeconds = elapsedSummary[0]?.totalElapsed ?? 0;
  const focusMinutes = Math.max(0, Math.round(totalElapsedSeconds / 60));

  return {
    totalTasks,
    completedTasks,
    activeTasks: Math.max(totalTasks - completedTasks, 0),
    focusMinutes,
    goalsAchieved,
    goalsActive,
  };
};

const toProfileResponse = async (
  user: UserDocument
): Promise<UserProfileResponse> => ({
  id: user._id.toHexString(),
  name: user.name,
  email: user.email,
  verified: user.verified,
  avatarUrl: user.avatarUrl ?? null,
  role: user.role ?? null,
  location: user.location ?? null,
  bio: user.bio ?? null,
  timezone: user.timezone ?? null,
  website: user.website ?? null,
  joinedAt: user.createdAt,
  stats: await buildStats(user._id.toHexString()),
});

const sanitizeOptional = (value: unknown) => {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const sanitizeName = (value: unknown) => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

export const getProfileDetails = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const objectId = parseObjectId(userId);
  if (!objectId) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  try {
    const users = await getUsersCollection();
    const user = await users.findOne({ _id: objectId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const profile = await toProfileResponse(user);
    res.json(profile);
  } catch (error) {
    console.error("Failed to load profile", error);
    res.status(500).json({ error: "Failed to load profile" });
  }
};

export const updateProfileDetails = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const objectId = parseObjectId(userId);
  if (!objectId) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const name = sanitizeName(req.body?.name);
  const role = sanitizeOptional(req.body?.role);
  const location = sanitizeOptional(req.body?.location);
  const bio = sanitizeOptional(req.body?.bio);
  const timezone = sanitizeOptional(req.body?.timezone);
  const website = sanitizeOptional(req.body?.website);

  const updates: Partial<UserDocument> = { updatedAt: Date.now() };

  if (name !== undefined) {
    updates.name = name;
  }
  if (role !== undefined) {
    updates.role = role;
  }
  if (location !== undefined) {
    updates.location = location;
  }
  if (bio !== undefined) {
    updates.bio = bio;
  }
  if (timezone !== undefined) {
    updates.timezone = timezone;
  }
  if (website !== undefined) {
    updates.website = website;
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  try {
    const users = await getUsersCollection();
    const updatedUser = await users.findOneAndUpdate(
      { _id: objectId },
      { $set: updates },
      { returnDocument: "after" }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const profile = await toProfileResponse(updatedUser);
    res.json(profile);
  } catch (error) {
    console.error("Failed to update profile", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const uploadProfileAvatar = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const objectId = parseObjectId(userId);
  if (!objectId) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    return res.status(400).json({ error: "Avatar file is required" });
  }
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)) {
    return res.status(400).json({ error: "Unsupported image format" });
  }

  try {
    const users = await getUsersCollection();
    const user = await users.findOne({ _id: objectId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const folder = `${env.cloudinary.baseFolder.replace(
      /\/$/,
      ""
    )}/users/${userId}`;
    const uploadResult = await uploadImageBuffer(file.buffer, {
      folder,
      publicId: "avatar",
    });

    if (user.avatarPublicId && user.avatarPublicId !== uploadResult.publicId) {
      await deleteImage(user.avatarPublicId);
    }

    await users.updateOne(
      { _id: objectId },
      {
        $set: {
          avatarUrl: uploadResult.secureUrl,
          avatarPublicId: uploadResult.publicId,
          updatedAt: Date.now(),
        },
      }
    );

    res.json({
      avatarUrl: uploadResult.secureUrl,
      message: "Avatar updated",
    });
  } catch (error) {
    console.error("Failed to upload avatar", error);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
};
