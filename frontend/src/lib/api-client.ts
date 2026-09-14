import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { API_BASE_URL } from "./env";
import { ApiUser } from "./api-types";
import { getAccessToken, setAccessToken } from "./token-store";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send the httpOnly refresh-token cookie
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Concurrent 401s while a refresh is in flight all wait on the same promise,
// instead of each firing their own /auth/refresh call (which would race and
// invalidate each other's rotated refresh token).
export interface RefreshSessionResponse {
  user: ApiUser;
  accessToken: string;
}

let refreshPromise: Promise<RefreshSessionResponse> | null = null;

export function refreshSession(): Promise<RefreshSessionResponse> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        const session: RefreshSessionResponse = res.data.data;
        setAccessToken(session.accessToken);
        return session;
      })
      .catch((error) => {
        setAccessToken(null);
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    const isAuthRoute = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"]
      .some((route) => original?.url?.includes(route));

    if (error.response?.status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;
      try {
        const session = await refreshSession();
        original.headers.Authorization = `Bearer ${session.accessToken}`;
        return apiClient(original);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

/** Shape of every API response envelope returned by the backend. */
export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export function unwrap<T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  return promise.then((res) => res.data.data);
}
