import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { pedidoService } from "./pedidoService";
import { EstadoBadge } from "../../components/EstadoBadge";
import { ConnectionBadge } from "../../components/ConnectionBadge";
import { PedidoDetailModal } from "./PedidoDetailModal";
import { useAdminOrdersFeed } from "../../hooks/useAdminOrdersFeed";
import type { EstadoPedidoCodigo } from "../../types";

const ESTADOS_FILTRO: { value: string; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "CONFIRMADO", label: "Confirmado" },
  { value: "EN_PREP", label: "En preparación" },
  { value: "ENTREGADO", label: "Entregado" },
  { value: "CANCELADO", label: "Cancelado" },
];

export function PedidosPage() {
  useAdminOrdersFeed();

  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["pedidos", estadoFiltro],
    queryFn: () =>
      pedidoService.list({
        estado_codigo: estadoFiltro || undefined,
        limit: 50,
      }),
    refetchInterval: 15000,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Pedidos</h1>
        <ConnectionBadge />
      </div>

      <div className="flex gap-2 mb-4">
        {ESTADOS_FILTRO.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setEstadoFiltro(opt.value)}
            className={`text-sm px-3 py-1.5 rounded-lg font-medium ${
              estadoFiltro === opt.value
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Forma de pago</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  Cargando...
                </td>
              </tr>
            )}

            {data?.items.map((pedido) => (
              <tr key={pedido.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-700">
                  #{pedido.id}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {format(new Date(pedido.created_at), "dd/MM/yyyy HH:mm")}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  ${pedido.total.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {pedido.forma_pago_codigo}
                </td>
                <td className="px-4 py-3">
                  <EstadoBadge estado={pedido.estado_codigo as EstadoPedidoCodigo} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setSelectedPedidoId(pedido.id)}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}

            {!isLoading && data?.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No hay pedidos todavía
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedPedidoId && (
        <PedidoDetailModal
          pedidoId={selectedPedidoId}
          onClose={() => setSelectedPedidoId(null)}
        />
      )}
    </div>
  );
}