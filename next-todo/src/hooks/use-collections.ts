"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";
import { Collection } from "@/types/task";
import { useAuth } from "@/contexts/auth-context";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected error";

export const useCollections = () => {
  const { token } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    if (!token) {
      setCollections([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = (await api.listCollections()) as Collection[];
      setCollections(data);
      setError(null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const createCollection = useCallback(
    async (payload: { name: string; description?: string; color?: string }) => {
      try {
        const created = (await api.createCollection(payload)) as Collection;
        setCollections((prev) => [created, ...prev]);
        setError(null);
        return created;
      } catch (err) {
        setError(errorMessage(err));
        throw err;
      }
    },
    []
  );

  const updateCollection = useCallback(
    async (id: string, updates: Partial<Collection>) => {
      try {
        const saved = (await api.updateCollection(id, updates)) as Collection;
        setCollections((prev) =>
          prev.map((collection) => (collection.id === id ? saved : collection))
        );
        setError(null);
        return saved;
      } catch (err) {
        setError(errorMessage(err));
        throw err;
      }
    },
    []
  );

  const deleteCollection = useCallback(async (id: string) => {
    try {
      await api.deleteCollection(id);
      setCollections((prev) => prev.filter((collection) => collection.id !== id));
      setError(null);
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    }
  }, []);

  const mapById = useMemo(() => {
    const map = new Map<string, Collection>();
    collections.forEach((collection) => map.set(collection.id, collection));
    return map;
  }, [collections]);

  return {
    collections,
    mapById,
    loading,
    error,
    refresh: fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
  };
};


