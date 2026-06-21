import { apiClient } from "../../api/client";
import type { Usuario } from "../../types";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario: Usuario;
}

export const authService = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  getMe: async (): Promise<Usuario> => {
    const response = await apiClient.get<Usuario>("/auth/me");
    return response.data;
  },
};