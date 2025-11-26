"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";

import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { SignInRequired } from "@/components/auth/sign-in-required";
import { ProfileDetails } from "@/types/user";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(timestamp));

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error";

type FormState = {
  name: string;
  role: string;
  location: string;
  timezone: string;
  website: string;
  bio: string;
};

const buildFormState = (profile?: ProfileDetails | null): FormState => ({
  name: profile?.name ?? "",
  role: profile?.role ?? "",
  location: profile?.location ?? "",
  timezone: profile?.timezone ?? "",
  website: profile?.website ?? "",
  bio: profile?.bio ?? "",
});

const StatCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white shadow-inner shadow-black/10 backdrop-blur">
    <p className="text-xs uppercase tracking-[0.4em] text-white/60">{label}</p>
    <p className="mt-2 text-3xl font-semibold">{value}</p>
    {hint && <p className="mt-1 text-xs text-white/70">{hint}</p>}
  </div>
);

const InfoField = ({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) => (
  <div>
    <p className="text-xs uppercase tracking-[0.35em] text-white/60">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-white/95">
      {value && value.trim() ? value : "—"}
    </p>
  </div>
);

const ProfileSkeleton = () => (
  <div className="mx-auto max-w-5xl animate-pulse rounded-[32px] border border-white/10 bg-white/5 p-10 text-white">
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="h-32 w-32 rounded-3xl bg-white/10" />
      <div className="flex-1 space-y-4">
        <div className="h-6 w-1/2 rounded-full bg-white/10" />
        <div className="h-4 w-1/3 rounded-full bg-white/10" />
        <div className="h-4 w-2/3 rounded-full bg-white/10" />
      </div>
    </div>
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={`s-${index}`} className="h-28 rounded-2xl bg-white/5" />
      ))}
    </div>
  </div>
);

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [formState, setFormState] = useState<FormState>(buildFormState());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = (await api.getProfile()) as ProfileDetails;
      setProfile(data);
      setFormState(buildFormState(data));
      setError(null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      return;
    }
    setSaving(true);
    setSuccess(null);
    try {
      const updated = (await api.updateProfile(formState)) as ProfileDetails;
      setProfile(updated);
      setFormState(buildFormState(updated));
      setError(null);
      setSuccess("Profile updated successfully.");
      await refreshProfile();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setAvatarUploading(true);
    setSuccess(null);
    try {
      const response = await api.uploadAvatar(file);
      setProfile((previous) =>
        previous ? { ...previous, avatarUrl: response.avatarUrl } : previous
      );
      await refreshProfile();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setAvatarUploading(false);
    }
  };

  const stats = profile?.stats;
  const joinedLabel = profile ? formatDate(profile.joinedAt) : "";

  const heroBackground = useMemo(
    () =>
      profile?.avatarUrl
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        : "bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900",
    [profile?.avatarUrl]
  );

  if (!user) {
    return (
      <div className="px-4 py-12">
        <SignInRequired
          title="Create your workspace"
          description="Sign in to personalize your task workspace, upload an avatar, and keep data synced."
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <section
          className={`rounded-[32px] border border-white/10 ${heroBackground} p-8 shadow-2xl`}
        >
          {loading ? (
            <ProfileSkeleton />
          ) : profile ? (
            <>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="flex items-start gap-5">
                  <div className="relative h-32 w-32 overflow-hidden rounded-[28px] border border-white/20 bg-white/10 shadow-2xl">
                    {profile.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl}
                        alt={profile.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-white">
                        {getInitials(profile.name)}
                      </div>
                    )}
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-3 left-3 right-3 inline-flex cursor-pointer items-center justify-center rounded-2xl bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow"
                    >
                      {avatarUploading ? "Uploading…" : "Change"}
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={avatarUploading}
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                      Profile
                    </p>
                    <h1 className="mt-2 text-4xl font-semibold">
                      {profile.name}
                    </h1>
                    <p className="mt-2 text-white/80">{profile.bio ?? ""}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/80">
                      {profile.role && (
                        <span className="rounded-full border border-white/25 px-3 py-1">
                          {profile.role}
                        </span>
                      )}
                      {profile.location && (
                        <span className="rounded-full border border-white/25 px-3 py-1">
                          {profile.location}
                        </span>
                      )}
                      {profile.timezone && (
                        <span className="rounded-full border border-white/25 px-3 py-1">
                          {profile.timezone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white">
                  <InfoField label="Email" value={profile.email} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoField label="Website" value={profile.website} />
                    <InfoField label="Member since" value={joinedLabel} />
                  </div>
                </div>
              </div>
              {stats && (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    label="Total tasks"
                    value={stats.totalTasks.toString()}
                    hint={`${stats.completedTasks} completed`}
                  />
                  <StatCard
                    label="Active tasks"
                    value={stats.activeTasks.toString()}
                    hint="Still in progress"
                  />
                  <StatCard
                    label="Focus minutes"
                    value={stats.focusMinutes.toString()}
                    hint="Tracked across sessions"
                  />
                  <StatCard
                    label="Goals"
                    value={`${stats.goalsAchieved}/${stats.goalsAchieved + stats.goalsActive}`}
                    hint={`${stats.goalsAchieved} achieved • ${stats.goalsActive} active`}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-lg text-white/80">
              Unable to load profile right now.
            </div>
          )}
        </section>

        {(error || success) && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              error
                ? "border-rose-400 bg-rose-50/20 text-rose-100"
                : "border-emerald-400 bg-emerald-50/20 text-emerald-100"
            }`}
          >
            {error ?? success}
          </div>
        )}

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">Personal details</h2>
              <p className="mt-2 text-sm text-white/70">
                Keep your workspace profile fresh so collaborators know who
                they&apos;re working with.
              </p>
              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="text-sm font-semibold">
                    <span className="mb-2 block text-xs uppercase tracking-[0.35em] text-white/60">
                      Full name
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={handleFieldChange}
                      className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                      placeholder="Enter your name"
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    <span className="mb-2 block text-xs uppercase tracking-[0.35em] text-white/60">
                      Role / Title
                    </span>
                    <input
                      type="text"
                      name="role"
                      value={formState.role}
                      onChange={handleFieldChange}
                      className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                      placeholder="Product Designer"
                    />
                  </label>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="text-sm font-semibold">
                    <span className="mb-2 block text-xs uppercase tracking-[0.35em] text-white/60">
                      Location
                    </span>
                    <input
                      type="text"
                      name="location"
                      value={formState.location}
                      onChange={handleFieldChange}
                      className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                      placeholder="Berlin, Germany"
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    <span className="mb-2 block text-xs uppercase tracking-[0.35em] text-white/60">
                      Time zone
                    </span>
                    <input
                      type="text"
                      name="timezone"
                      value={formState.timezone}
                      onChange={handleFieldChange}
                      className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                      placeholder="GMT+2"
                    />
                  </label>
                </div>
                <label className="text-sm font-semibold">
                  <span className="mb-2 block text-xs uppercase tracking-[0.35em] text-white/60">
                    Website / Portfolio
                  </span>
                  <input
                    type="url"
                    name="website"
                    value={formState.website}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                    placeholder="https://"
                  />
                </label>
                <label className="text-sm font-semibold">
                  <span className="mb-2 block text-xs uppercase tracking-[0.35em] text-white/60">
                    Bio
                  </span>
                  <textarea
                    name="bio"
                    value={formState.bio}
                    onChange={handleFieldChange}
                    rows={4}
                    className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
                    placeholder="Tell us about your focus, work style, or goals."
                  />
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setFormState(buildFormState(profile));
                      setSuccess(null);
                    }}
                    className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white/50 disabled:opacity-50"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
            <div className="w-full rounded-[28px] border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 text-sm text-white/80 lg:max-w-sm">
              <h3 className="text-lg font-semibold text-white">
                Activity snapshot
              </h3>
              <p className="mt-2 text-white/70">
                Quick overview of how your focus time stacks up.
              </p>
              <div className="mt-6 space-y-4">
                <InfoField
                  label="Completed this week"
                  value={
                    stats
                      ? `${Math.min(stats.completedTasks, stats.totalTasks)} tasks`
                      : null
                  }
                />
                <InfoField
                  label="Currently running"
                  value={
                    stats
                      ? `${stats.activeTasks} task${stats.activeTasks === 1 ? "" : "s"}`
                      : null
                  }
                />
                <InfoField
                  label="Total goals achieved"
                  value={stats ? `${stats.goalsAchieved}` : null}
                />
                <InfoField
                  label="Focus time"
                  value={stats ? `${stats.focusMinutes} minutes` : null}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;

