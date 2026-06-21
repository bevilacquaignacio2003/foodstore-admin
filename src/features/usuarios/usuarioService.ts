import { apiClient } from "../../api/client";
import type { Usuario, Rol, RolCodigo, Paginated } from "../../types";

interface ListParams {
  skip?: number;
  limit?: number;
  rol_codigo?: string;
}

export const usuarioService = {
  list: async (params: ListParams = {}): Promise<Paginated<Usuario>> => {
    const response = await apiClient.get<Paginated<Usuario>>("/admin/usuarios", {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Usuario> => {
    const response = await apiClient.get<Usuario>(`/admin/usuarios/${id}`);
    return response.data;
  },

  update: async (id: number, data: Partial<Usuario>): Promise<Usuario> => {
    const response = await apiClient.put<Usuario>(`/admin/usuarios/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/usuarios/${id}`);
  },

  asignarRol: async (id: number, rol_codigo: RolCodigo): Promise<Usuario> => {
    const response = await apiClient.post<Usuario>(`/admin/usuarios/${id}/roles`, {
      rol_codigo,
    });
    return response.data;
  },

  removerRol: async (id: number, rol_codigo: RolCodigo): Promise<Usuario> => {
    const response = await apiClient.delete<Usuario>(
      `/admin/usuarios/${id}/roles/${rol_codigo}`
    );
    return response.data;
  },

  listRoles: async (): Promise<Rol[]> => {
    const response = await apiClient.get<Rol[]>("/admin/roles");
    return response.data;
  },
};