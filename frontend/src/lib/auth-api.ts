import { apiClient, unwrap } from "./api-client";
import { ApiUser } from "./api-types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  parentPhone: string;
  studyLanguage: string;
  educationLevel: string;
  grade: string;
  password: string;
}

interface AuthResponse {
  user: ApiUser;
  accessToken: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    unwrap<AuthResponse>(apiClient.post("/auth/login", payload)),

  register: (payload: RegisterPayload) =>
    unwrap<AuthResponse>(apiClient.post("/auth/register", payload)),

  refresh: () => unwrap<AuthResponse>(apiClient.post("/auth/refresh")),

  logout: () => unwrap<null>(apiClient.post("/auth/logout")),

  me: () => unwrap<{ user: ApiUser }>(apiClient.get("/auth/me")).then((d) => d.user),
};
