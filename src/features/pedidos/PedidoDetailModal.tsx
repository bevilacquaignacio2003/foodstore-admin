import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { X } from "lucide-react";
import { pedidoService } from "./pedidoService";
import { EstadoBadge } from "../../components/EstadoBadge";
import { notifyError, notifySuccess } from "../../store/toastStore";
import type { EstadoPedidoCodigo } from "../../types";

const TRANSICIONES: Record<EstadoPedidoCodigo, EstadoPedidoCodigo[]> = {
  PENDIENTE: ["CONFIRMADO", "CANCELADO"],
  CONFIRMADO: ["EN_PREP", "CANCELADO"],
  EN_PREP: ["ENTREGADO", "CANCELADO"],
  ENTREGADO: [],
  CANCELADO: [],
};

const ETIQUETAS: Record<EstadoPedidoCodigo, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmar",
  EN_PREP: "Pasar a preparación",
  ENTREGADO: "Marcar entregado",
  CANCELADO: "Cancelar",
};

interface PedidoDetailModalProps {
  pedidoId: number;
  onClose: () => void;
}

export function PedidoDetailModal({ pedidoId, onClose }: PedidoDetailModalProps) {
  const queryClient = useQueryClient();
  const [motivo, setMotivo] = useState("");
  const [showMotivoFor, setShowMotivoFor] = useState<EstadoPedidoCodigo | null>(null);

  const { data: pedido, isLoading } = useQuery({
    queryKey: ["pedido", pedidoId],
    queryFn: () => pedidoService.getById(pedidoId),
  });

  const avanzarEstado = useMutation({
    mutationFn: (nuevo_estado: EstadoPedidoCodigo) =>
      pedidoService.avanzarEstado(pedidoId, {
        nuevo_estado,
        motivo: nuevo_estado === "CANCELADO" ? motivo : null,
      }),
    onSuccess: (_, nuevo_estado) => {
      queryClient.invalidateQueries({ queryKey: ["pedido", pedidoId] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      setShowMotivoFor(null);
      setMotivo("");
      notifySuccess(`Pedido actualizado a ${ETIQUETAS[nuevo_estado] || nuevo_estado}`);
    },
    onError: (err: any) => {
      notifyError(err.response?.data?.detail || "Error al cambiar el estado del pedido");
    },
  });

  const handleTransicion = (nuevoEstado: EstadoPedidoCodigo) => {
    if (nuevoEstado === "CANCELADO") {
      setShowMotivoFor("CANCELADO");
      return;
    }
    avanzarEstado.mutate(nuevoEstado);
  };

  const handleConfirmarCancelacion = () => {
    if (!motivo.trim()) {
      notifyError("El motivo es obligatorio para cancelar");
      return;
    }
    avanzarEstado.mutate("CANCELADO");
  };

  const transicionesDisponibles = pedido
    ? TRANSICIONES[pedido.estado_codigo]
    : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Pedido #{pedidoId}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {isLoading && <p className="text-slate-400">Cargando...</p>}

          {pedido && (
            <>
              <div className="flex items-center justify-between">
                <EstadoBadge estado={pedido.estado_codigo} />
                <span className="text-sm text-slate-500">
                  {format(new Date(pedido.created_at), "dd/MM/yyyy HH:mm")}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Productos
                </h3>
                <div className="bg-slate-50 rounded-lg divide-y divide-slate-200">
                  {pedido.detalles?.map((detalle) => (
                    <div
                      key={detalle.producto_id}
                      className="flex justify-between px-3 py-2 text-sm"
                    >
                      <span className="text-slate-700">
                        {detalle.cantidad}x {detalle.nombre_snapshot}
                      </span>
                      <span className="text-slate-600 font-medium">
                        ${detalle.subtotal_snap.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 space-y-1 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${pedido.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Descuento</span>
                  <span>-${pedido.descuento.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío</span>
                  <span>${pedido.costo_envio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-800 pt-1 border-t border-slate-200">
                  <span>Total</span>
                  <span>${pedido.total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Historial
                </h3>
                <div className="space-y-2">
                  {pedido.historial?.map((h) => (
                    <div key={h.id} className="text-xs text-slate-500 flex gap-2">
                      <span className="font-medium text-slate-700">
                        {h.estado_desde || "Creación"} → {h.estado_hacia}
                      </span>
                      <span>
                        {format(new Date(h.created_at), "dd/MM HH:mm")}
                      </span>
                      {h.motivo && <span className="italic">({h.motivo})</span>}
                    </div>
                  ))}
                </div>
              </div>

              {transicionesDisponibles.length > 0 && (
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">
                    Cambiar estado
                  </h3>

                  {showMotivoFor === "CANCELADO" ? (
                    <div className="space-y-2">
                      <textarea
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Motivo de la cancelación (obligatorio)"
                        rows={2}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowMotivoFor(null)}
                          className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                          Volver
                        </button>
                        <button
                          onClick={handleConfirmarCancelacion}
                          disabled={avanzarEstado.isPending}
                          className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50"
                        >
                          Confirmar cancelación
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 flex-wrap">
                      {transicionesDisponibles.map((estado) => (
                        <button
                          key={estado}
                          onClick={() => handleTransicion(estado)}
                          disabled={avanzarEstado.isPending}
                          className={`text-sm px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 ${
                            estado === "CANCELADO"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-orange-500 text-white hover:bg-orange-600"
                          }`}
                        >
                          {ETIQUETAS[estado]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}