import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Usuario } from "../types";

interface AuthState {
  usuario: Usuario | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUsuario: (usuario: Usuario | null, accessToken?: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      accessToken: null,
      isAuthenticated: false,
      setUsuario: (usuario, accessToken) =>
        set({
          usuario,
          accessToken: accessToken ?? null,
          isAuthenticated: !!usuario,
        }),
      logout: () => set({ usuario: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: "foodstore-admin-auth",
      partialize: (state) => ({ usuario: state.usuario, accessToken: state.accessToken }),
    }
  )
);