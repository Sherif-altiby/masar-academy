"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi, LoginPayload, RegisterPayload } from "@/lib/auth-api";
import { ApiUser } from "@/lib/api-types";
import { setAccessToken } from "@/lib/token-store";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: ApiUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  login: (payload: LoginPayload) => Promise<ApiUser>;
  register: (payload: RegisterPayload) => Promise<ApiUser>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = React.useState<ApiUser | null>(null);
  const [status, setStatus] = React.useState<AuthStatus>("loading");

  // On first load, there's no access token in memory (a full page reload
  // wipes JS state) — so we silently try to trade the httpOnly refresh
  // cookie for a new access token. If that fails, the visitor is simply
  // logged out; no error is shown for this expected case.
  React.useEffect(() => {
    let cancelled = false;

    authApi
      .refresh()
      .then((res) => {
        if (cancelled) return;
        setAccessToken(res.accessToken);
        setUser(res.user);
        setStatus("authenticated");
      })
      .catch(() => {
        if (cancelled) return;
        setAccessToken(null);
        setUser(null);
        setStatus("unauthenticated");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      setAccessToken(res.accessToken);
      setUser(res.user);
      setStatus("authenticated");
      queryClient.clear();
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (res) => {
      setAccessToken(res.accessToken);
      setUser(res.user);
      setStatus("authenticated");
      queryClient.clear();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      setAccessToken(null);
      setUser(null);
      setStatus("unauthenticated");
      queryClient.clear();
    },
  });

  const value: AuthContextValue = {
    user,
    status,
    isAuthenticated: status === "authenticated",
    isTeacher: user?.role === "TEACHER",
    isStudent: user?.role === "STUDENT",
    login: (payload) => loginMutation.mutateAsync(payload).then((r) => r.user),
    register: (payload) => registerMutation.mutateAsync(payload).then((r) => r.user),
    logout: () => logoutMutation.mutateAsync().then(() => undefined),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
