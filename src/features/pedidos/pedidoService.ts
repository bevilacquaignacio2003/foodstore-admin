import { apiClient } from "../../api/client";
import type { Pedido, EstadoPedidoCodigo, Paginated } from "../../types";

interface ListParams {
  skip?: number;
  limit?: number;
  estado_codigo?: string;
}

interface AvanzarEstadoPayload {
  nuevo_estado: EstadoPedidoCodigo;
  motivo?: string | null;
}

export const pedidoService = {
  list: async (params: ListParams = {}): Promise<Paginated<Pedido>> => {
    const response = await apiClient.get<Paginated<Pedido>>("/pedidos/", {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Pedido> => {
    const response = await apiClient.get<Pedido>(`/pedidos/${id}`);
    return response.data;
  },

  avanzarEstado: async (
    id: number,
    data: AvanzarEstadoPayload
  ): Promise<Pedido> => {
    const response = await apiClient.patch<Pedido>(
      `/pedidos/${id}/estado`,
      data
    );
    return response.data;
  },
};