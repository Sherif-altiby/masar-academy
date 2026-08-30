import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { API_BASE_URL } from "./env";
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
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        const token: string = res.data.data.accessToken;
        setAccessToken(token);
        return token;
      })
      .catch(() => {
        setAccessToken(null);
        return null;
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

    const isAuthRoute = original?.url?.includes("/auth/login") || original?.url?.includes("/auth/register");

    if (error.response?.status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
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
