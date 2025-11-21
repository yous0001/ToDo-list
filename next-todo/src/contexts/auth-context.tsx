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
  user?: User;
};

const readStoredAuth = (): StoredAuth | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
};

const writeStoredAuth = (auth: StoredAuth | null) => {
  if (typeof window === "undefined") {
    return;
  }
  if (!auth) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = readStoredAuth();
    if (stored?.token) {
      setToken(stored.token);
      setAuthToken(stored.token);
      if (stored.user) {
        setUser(stored.user);
      }
    }
    setInitialized(true);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) {
      return;
    }
    try {
      const profile = (await api.me()) as User;
      setUser(profile);
      writeStoredAuth({ token, user: profile });
    } catch (error) {
      const status = (error as Error & { status?: number })?.status;
      if (status === 401 || status === 403) {
        setUser(null);
        setToken(null);
        setAuthToken(null);
        writeStoredAuth(null);
      } else {
        console.error("Failed to refresh profile", error);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    if (!token) {
      setUser(null);
      setAuthToken(null);
      writeStoredAuth(null);
      setLoading(false);
      return;
    }
    setAuthToken(token);
    refreshProfile();
  }, [token, initialized, refreshProfile]);

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
      writeStoredAuth({ token: result.token, user: result.user });
      setLoading(false);
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setAuthToken(null);
    setUser(null);
    writeStoredAuth(null);
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


