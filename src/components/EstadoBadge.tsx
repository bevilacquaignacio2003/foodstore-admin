import type { EstadoPedidoCodigo } from "../types";

const estilos: Record<EstadoPedidoCodigo, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  CONFIRMADO: "bg-blue-100 text-blue-700",
  EN_PREP: "bg-purple-100 text-purple-700",
  ENTREGADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
};

const etiquetas: Record<EstadoPedidoCodigo, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  EN_PREP: "En preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export function EstadoBadge({ estado }: { estado: EstadoPedidoCodigo }) {
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${estilos[estado]}`}
    >
      {etiquetas[estado]}
    </span>
  );
}