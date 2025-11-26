export type User = {
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
  completedTasks: number;
  activeTasks: number;
  focusMinutes: number;
  goalsAchieved: number;
  goalsActive: number;
};

export type ProfileDetails = User & {
  joinedAt: number;
  stats: ProfileStats;
};
