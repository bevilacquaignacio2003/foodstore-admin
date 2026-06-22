import { apiClient } from "../../api/client";
import type { Ingrediente, Paginated } from "../../types";

interface IngredientePayload {
  nombre: string;
  descripcion?: string | null;
  stock_cantidad: number;
  es_alergeno: boolean;
}

interface ListParams {
  skip?: number;
  limit?: number;
  es_alergeno?: boolean;
  search?: string;
}

export const ingredienteService = {
  list: async (params: ListParams = {}): Promise<Paginated<Ingrediente>> => {
    const response = await apiClient.get<Paginated<Ingrediente>>("/ingredientes/", {
      params,
    });
    return response.data;
  },

  create: async (data: IngredientePayload): Promise<Ingrediente> => {
    const response = await apiClient.post<Ingrediente>("/ingredientes/", data);
    return response.data;
  },

  update: async (id: number, data: Partial<IngredientePayload>): Promise<Ingrediente> => {
    const response = await apiClient.put<Ingrediente>(`/ingredientes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/ingredientes/${id}`);
  },
};