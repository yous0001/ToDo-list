import { getAuthToken } from "./auth-token";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:4000";

type RequestOptions = Omit<RequestInit, "headers"> & {
  parseJson?: boolean;
  auth?: boolean;
  headers?: Record<string, string>;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { parseJson = true, headers, body, auth = false, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers ?? {}),
  };

  if (auth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("You must be signed in to perform this action.");
    }
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: finalHeaders,
    body,
    ...rest,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const data = await response.json();
      message = data.error ?? message;
    } catch {
      // ignore JSON parsing errors
    }
    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  if (!parseJson) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  listTasks: () => apiRequest("/tasks", { auth: true }),
  createTask: (payload: {
    title: string;
    description?: string;
    startDate?: number | null;
    dueDate?: number | null;
  }) =>
    apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    }),
  updateTask: (id: string, payload: Partial<Record<string, unknown>>) =>
    apiRequest(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      auth: true,
    }),
  deleteTask: (id: string) =>
    apiRequest(`/tasks/${id}`, {
      method: "DELETE",
      parseJson: false,
      auth: true,
    }),
  listGoals: () => apiRequest("/goals", { auth: true }),
  createGoal: (payload: {
    title: string;
    type: "daily" | "weekly" | "monthly";
    targetMinutes: number;
  }) =>
    apiRequest("/goals", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    }),
  updateGoal: (id: string, payload: Partial<Record<string, unknown>>) =>
    apiRequest(`/goals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      auth: true,
    }),
  deleteGoal: (id: string) =>
    apiRequest(`/goals/${id}`, {
      method: "DELETE",
      parseJson: false,
      auth: true,
    }),
  register: (payload: { name: string; email: string; password: string }) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  verifyEmail: (payload: { token: string }) =>
    apiRequest("/auth/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    apiRequest<{
      token: string;
      user: { id: string; name: string; email: string; verified: boolean };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () =>
    apiRequest("/auth/me", {
      auth: true,
    }),
};
