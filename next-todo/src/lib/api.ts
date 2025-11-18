const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:4000";

type RequestOptions = RequestInit & {
  parseJson?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { parseJson = true, headers, body, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
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
    throw new Error(message);
  }

  if (!parseJson) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  listTasks: () => apiRequest("/tasks"),
  createTask: (payload: {
    title: string;
    description?: string;
    startDate?: number | null;
    dueDate?: number | null;
  }) =>
    apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateTask: (id: string, payload: Partial<Record<string, unknown>>) =>
    apiRequest(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteTask: (id: string) =>
    apiRequest(`/tasks/${id}`, {
      method: "DELETE",
      parseJson: false,
    }),
  listGoals: () => apiRequest("/goals"),
  createGoal: (payload: {
    title: string;
    type: "daily" | "weekly" | "monthly";
    targetMinutes: number;
  }) =>
    apiRequest("/goals", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateGoal: (id: string, payload: Partial<Record<string, unknown>>) =>
    apiRequest(`/goals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteGoal: (id: string) =>
    apiRequest(`/goals/${id}`, {
      method: "DELETE",
      parseJson: false,
    }),
};
