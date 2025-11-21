"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";
import { Task } from "@/types/task";
import { getDisplaySeconds, nowMs } from "@/utils/time";
import { useAuth } from "@/contexts/auth-context";

export type TaskSummary = {
  total: number;
  completed: number;
  running: number;
  totalSeconds: number;
};

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error";

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [now, setNow] = useState(() => nowMs());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchTasks = useCallback(async () => {
    if (!token) {
      setTasks([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = (await api.listTasks()) as Task[];
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const refreshNow = useCallback(() => {
    setNow(nowMs());
  }, []);

  const anyRunning = useMemo(() => tasks.some((task) => task.running), [tasks]);

  useEffect(() => {
    if (!anyRunning) {
      return;
    }
    const interval = window.setInterval(refreshNow, 1000);
    return () => window.clearInterval(interval);
  }, [anyRunning, refreshNow]);

  const mutateTask = useCallback(
    async (id: string, getUpdates: (task: Task) => Partial<Task>) => {
      if (!token) {
        return;
      }
      const current = tasks.find((task) => task.id === id);
      if (!current) {
        return;
      }
      const updates = getUpdates(current);
      setTasks((previous) =>
        previous.map((task) =>
          task.id === id ? { ...task, ...updates, updatedAt: nowMs() } : task
        )
      );
      try {
        const saved = (await api.updateTask(id, updates)) as Task;
        setTasks((previous) =>
          previous.map((task) => (task.id === id ? saved : task))
        );
      } catch (err) {
        console.error(err);
        setError(errorMessage(err));
        fetchTasks();
      }
    },
    [tasks, fetchTasks, token]
  );

  const addTask = useCallback(
    async (
      title: string,
      description: string,
      startDate: number | null = null,
      dueDate: number | null = null,
      collectionId: string | null = null
    ) => {
      if (!token) {
        return;
      }
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        return;
      }
      try {
        const created = (await api.createTask({
          title: trimmedTitle,
          description: description.trim(),
          startDate,
          dueDate,
          collectionId,
        })) as Task;
        setTasks((previous) => [created, ...previous]);
        setError(null);
        refreshNow();
      } catch (err) {
        console.error(err);
        setError(errorMessage(err));
      }
    },
    [refreshNow, token]
  );

  const editTaskDetails = useCallback(
    (
      id: string,
      title: string,
      description: string,
      startDate: number | null = null,
      dueDate: number | null = null,
      collectionId: string | null = null
    ) => {
      mutateTask(id, () => ({
        title: title.trim(),
        description: description.trim(),
        startDate,
        dueDate,
        collectionId,
      }));
    },
    [mutateTask]
  );

  const startTimer = useCallback(
    (id: string) => {
      const timestamp = nowMs();
      mutateTask(id, (task) =>
        task.running
          ? {}
          : {
              running: true,
              lastStartedAt: timestamp,
              completed: false,
              completedAt: null,
              firstStartedAt: task.firstStartedAt ?? timestamp,
            }
      );
      setNow(timestamp);
    },
    [mutateTask]
  );

  const pauseTimer = useCallback(
    (id: string) => {
      const timestamp = nowMs();
      mutateTask(id, (task) => {
        if (!task.running || !task.lastStartedAt) {
          return { running: false, lastStartedAt: null };
        }
        const increment = Math.max(
          0,
          Math.floor((timestamp - task.lastStartedAt) / 1000)
        );
        return {
          running: false,
          lastStartedAt: null,
          elapsed: task.elapsed + increment,
        };
      });
      setNow(timestamp);
    },
    [mutateTask]
  );

  const resetTimer = useCallback(
    (id: string) => {
      mutateTask(id, () => ({
        elapsed: 0,
        running: false,
        lastStartedAt: null,
      }));
      refreshNow();
    },
    [mutateTask, refreshNow]
  );

  const toggleComplete = useCallback(
    (id: string) => {
      const timestamp = nowMs();
      mutateTask(id, (task) => {
        let elapsed = task.elapsed;
        if (task.running && task.lastStartedAt) {
          elapsed += Math.max(
            0,
            Math.floor((timestamp - task.lastStartedAt) / 1000)
          );
        }
        return {
          completed: !task.completed,
          running: false,
          lastStartedAt: null,
          elapsed,
          completedAt: !task.completed ? timestamp : null,
        };
      });
      setNow(timestamp);
    },
    [mutateTask]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!token) {
        return;
      }
      setTasks((previous) => previous.filter((task) => task.id !== id));
      try {
      await api.deleteTask(id);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(errorMessage(err));
        fetchTasks();
      }
    },
    [fetchTasks, token]
  );

  const summary: TaskSummary = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    const running = tasks.filter((task) => task.running).length;
    const totalSeconds = tasks.reduce(
      (accumulator, task) => accumulator + getDisplaySeconds(task, now),
      0
    );
    return {
      total: tasks.length,
      completed,
      running,
      totalSeconds,
    };
  }, [tasks, now]);

  return {
    tasks,
    summary,
    now,
    loading,
    error,
    refresh: fetchTasks,
    addTask,
    editTaskDetails,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleComplete,
    deleteTask,
  };
};
