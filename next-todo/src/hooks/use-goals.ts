"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";
import { Goal } from "@/types/task";
import { useAuth } from "@/contexts/auth-context";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error";

export const useGoals = () => {
  const { token } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!token) {
      setGoals([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = (await api.listGoals()) as Goal[];
      setGoals(data);
      setError(null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const createGoal = useCallback(
    async (payload: {
      title: string;
      type: Goal["type"];
      targetMinutes: number;
      collectionId?: string | null;
    }) => {
      try {
        const created = (await api.createGoal(payload)) as Goal;
        setGoals((prev) => [created, ...prev]);
        setError(null);
        return created;
      } catch (err) {
        setError(errorMessage(err));
        throw err;
      }
    },
    []
  );

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    try {
      const saved = (await api.updateGoal(id, updates)) as Goal;
      setGoals((prev) => prev.map((goal) => (goal.id === id ? saved : goal)));
      setError(null);
      return saved;
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    }
  }, []);

  const deleteGoal = useCallback(async (id: string) => {
    try {
      await api.deleteGoal(id);
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
      setError(null);
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    }
  }, []);

  const groupedByType = useMemo(() => {
    return goals.reduce<Record<Goal["type"], Goal[]>>(
      (acc, goal) => {
        acc[goal.type].push(goal);
        return acc;
      },
      {
        daily: [],
        weekly: [],
        monthly: [],
      }
    );
  }, [goals]);

  return {
    goals,
    groupedByType,
    loading,
    error,
    refresh: fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  };
};
