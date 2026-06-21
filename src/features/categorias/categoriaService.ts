import { apiClient } from "../../api/client";
import type { Categoria, Paginated } from "../../types";

interface CategoriaPayload {
  nombre: string;
  descripcion?: string | null;
  parent_id?: number | null;
  imagen_url?: string | null;
}

export const categoriaService = {
  list: async (includeSubcategorias = true): Promise<Paginated<Categoria>> => {
    const response = await apiClient.get<Paginated<Categoria>>("/categorias/", {
      params: { include_subcategorias: includeSubcategorias, limit: 100 },
    });
    return response.data;
  },

  listFlat: async (): Promise<Categoria[]> => {
    const response = await apiClient.get<Categoria[]>("/categorias/flat");
    return response.data;
  },

  getById: async (id: number): Promise<Categoria> => {
    const response = await apiClient.get<Categoria>(`/categorias/${id}`);
    return response.data;
  },

  create: async (data: CategoriaPayload): Promise<Categoria> => {
    const response = await apiClient.post<Categoria>("/categorias/", data);
    return response.data;
  },

  update: async (id: number, data: Partial<CategoriaPayload>): Promise<Categoria> => {
    const response = await apiClient.put<Categoria>(`/categorias/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/categorias/${id}`);
  },
};