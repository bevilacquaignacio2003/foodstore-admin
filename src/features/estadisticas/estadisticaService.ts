import { apiClient } from "../../api/client";

interface ResumenKPIs {
  ventas_hoy: number;
  ticket_promedio: number;
  pedidos_activos: number;
  ingresos_mes: number;
}

interface VentasPeriodoItem {
  periodo: string;
  total_ventas: number;
  cantidad_pedidos: number;
}

interface ProductoTopItem {
  nombre: string;
  ingresos: number;
  cantidad_vendida: number;
}

interface PedidosEstadoItem {
  estado_codigo: string;
  cantidad: number;
}

interface IngresoFormaPagoItem {
  forma_pago_codigo: string;
  total: number;
  cantidad: number;
}

export const estadisticaService = {
  getResumen: async (): Promise<ResumenKPIs> => {
    const response = await apiClient.get<ResumenKPIs>("/estadisticas/resumen");
    return response.data;
  },

  getVentas: async (
    desde: string,
    hasta: string,
    agrupacion: "day" | "week" | "month" = "day"
  ): Promise<VentasPeriodoItem[]> => {
    const response = await apiClient.get<VentasPeriodoItem[]>("/estadisticas/ventas", {
      params: { desde, hasta, agrupacion },
    });
    return response.data;
  },

  getProductosTop: async (limit = 10): Promise<ProductoTopItem[]> => {
    const response = await apiClient.get<ProductoTopItem[]>(
      "/estadisticas/productos-top",
      { params: { limit } }
    );
    return response.data;
  },

  getPedidosPorEstado: async (): Promise<PedidosEstadoItem[]> => {
    const response = await apiClient.get<PedidosEstadoItem[]>(
      "/estadisticas/pedidos-por-estado"
    );
    return response.data;
  },

  getIngresos: async (
    desde: string,
    hasta: string
  ): Promise<IngresoFormaPagoItem[]> => {
    const response = await apiClient.get<IngresoFormaPagoItem[]>(
      "/estadisticas/ingresos",
      { params: { desde, hasta } }
    );
    return response.data;
  },
};