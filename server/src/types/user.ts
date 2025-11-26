import { ObjectId } from "mongodb";

export type UserDocument = {
  _id: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  verified: boolean;
  verificationToken: string | null;
  createdAt: number;
  updatedAt: number;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
  role?: string | null;
  location?: string | null;
  bio?: string | null;
  timezone?: string | null;
  website?: string | null;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  avatarUrl: string | null;
  role: string | null;
  location: string | null;
  bio: string | null;
  timezone: string | null;
  website: string | null;
};

export type ProfileStats = {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  focusMinutes: number;
  goalsAchieved: number;
  goalsActive: number;
};

export type UserProfileResponse = PublicUser & {
  joinedAt: number;
  stats: ProfileStats;
};
