import { apiClient, refreshSession, unwrap } from "./api-client";
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
  educationLevel: string;
  grade: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  email: string;
  phone: string;
  parentPhone: string;
  educationLevel: string;
  grade: string;
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

  refresh: () => refreshSession(),

  logout: () => unwrap<null>(apiClient.post("/auth/logout")),

  me: () =>
    unwrap<{ user: ApiUser }>(apiClient.get("/auth/me")).then((d) => d.user),

  updateProfile: (payload: UpdateProfilePayload) =>
    unwrap<{ user: ApiUser }>(apiClient.patch("/auth/profile", payload)).then(
      (d) => d.user
    ),

  changePassword: (payload: ChangePasswordPayload) =>
    unwrap<null>(apiClient.post("/auth/change-password", payload)),
};
