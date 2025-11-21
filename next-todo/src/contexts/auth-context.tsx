"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/auth-token";
import { User } from "@/types/user";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (payload: {
    name: string;
    email: string;
    password: string;
  }) => Promise<string>;
  verifyEmail: (token: string) => Promise<string>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "smart-todo-auth";

type StoredAuth = {
  token: string;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const storedRaw = localStorage.getItem(STORAGE_KEY);
    if (!storedRaw) {
      setLoading(false);
      return;
    }
    try {
      const stored: StoredAuth = JSON.parse(storedRaw);
      if (stored.token) {
        setToken(stored.token);
        setAuthToken(stored.token);
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = (await api.me()) as User;
      setUser(profile);
    } catch (error) {
      console.error("Failed to refresh profile", error);
      setUser(null);
      setToken(null);
      setAuthToken(null);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token }));
      setAuthToken(token);
      refreshProfile();
    } else if (!loading) {
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [token, refreshProfile, loading]);

  const register = useCallback(
    async (payload: { name: string; email: string; password: string }) => {
      const response = (await api.register(payload)) as { message?: string };
      return (
        response.message ??
        "Registration successful. Please check your inbox to verify."
      );
    },
    []
  );

  const verifyEmail = useCallback(async (verificationToken: string) => {
    const response = (await api.verifyEmail({
      token: verificationToken,
    })) as { message: string };
    return response.message;
  }, []);

  const login = useCallback(
    async (payload: { email: string; password: string }) => {
      const result = (await api.login(payload)) as {
        token: string;
        user: User;
      };
      setToken(result.token);
      setAuthToken(result.token);
      setUser(result.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: result.token }));
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      register,
      verifyEmail,
      login,
      logout,
      refreshProfile,
    }),
    [user, token, loading, register, verifyEmail, login, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};


