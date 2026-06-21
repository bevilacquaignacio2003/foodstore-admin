import { apiClient } from "../../api/client";
import type { Producto, Paginated } from "../../types";

interface ProductoPayload {
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  unidad_venta_id?: number | null;
  imagenes_url?: string[];
  stock_cantidad: number;
  disponible: boolean;
}

interface ListParams {
  skip?: number;
  limit?: number;
  categoria_id?: number;
  disponible?: boolean;
  search?: string;
}

export const productoService = {
  list: async (params: ListParams = {}): Promise<Paginated<Producto>> => {
    const response = await apiClient.get<Paginated<Producto>>("/productos/", {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Producto> => {
    const response = await apiClient.get<Producto>(`/productos/${id}`);
    return response.data;
  },

  create: async (data: ProductoPayload): Promise<Producto> => {
    const response = await apiClient.post<Producto>("/productos/", data);
    return response.data;
  },

  update: async (id: number, data: Partial<ProductoPayload>): Promise<Producto> => {
    const response = await apiClient.put<Producto>(`/productos/${id}`, data);
    return response.data;
  },

  updateDisponibilidad: async (id: number, disponible: boolean): Promise<Producto> => {
    const response = await apiClient.patch<Producto>(
      `/productos/${id}/disponibilidad`,
      { disponible }
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/productos/${id}`);
  },
};