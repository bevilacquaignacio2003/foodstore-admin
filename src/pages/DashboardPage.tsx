import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, ShoppingBag, TrendingUp, Receipt } from "lucide-react";
import { format, subDays } from "date-fns";
import { estadisticaService } from "../features/estadisticas/estadisticaService";
import { StatCard } from "../components/StatCard";

const COLORES_ESTADO: Record<string, string> = {
  PENDIENTE: "#eab308",
  CONFIRMADO: "#3b82f6",
  EN_PREP: "#a855f7",
  ENTREGADO: "#22c55e",
  CANCELADO: "#ef4444",
};

export function DashboardPage() {
  const hoy = format(new Date(), "yyyy-MM-dd");
  const hace30dias = format(subDays(new Date(), 30), "yyyy-MM-dd");

  const { data: resumen } = useQuery({
    queryKey: ["estadisticas-resumen"],
    queryFn: () => estadisticaService.getResumen(),
    refetchInterval: 30000,
  });

  const { data: ventas } = useQuery({
    queryKey: ["estadisticas-ventas"],
    queryFn: () => estadisticaService.getVentas(hace30dias, hoy, "day"),
  });

  const { data: productosTop } = useQuery({
    queryKey: ["estadisticas-productos-top"],
    queryFn: () => estadisticaService.getProductosTop(5),
  });

  const { data: pedidosEstado } = useQuery({
    queryKey: ["estadisticas-pedidos-estado"],
    queryFn: () => estadisticaService.getPedidosPorEstado(),
  });

  const { data: ingresos } = useQuery({
    queryKey: ["estadisticas-ingresos"],
    queryFn: () => estadisticaService.getIngresos(hace30dias, hoy),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Ventas hoy"
          value={`$${(resumen?.ventas_hoy ?? 0).toFixed(2)}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          label="Ticket promedio"
          value={`$${(resumen?.ticket_promedio ?? 0).toFixed(2)}`}
          icon={Receipt}
          color="bg-blue-500"
        />
        <StatCard
          label="Pedidos activos"
          value={`${resumen?.pedidos_activos ?? 0}`}
          icon={ShoppingBag}
          color="bg-purple-500"
        />
        <StatCard
          label="Ingresos del mes"
          value={`$${(resumen?.ingresos_mes ?? 0).toFixed(2)}`}
          icon={TrendingUp}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Ventas por período
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={ventas ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total_ventas"
                stroke="#f97316"
                name="Total ventas"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="cantidad_pedidos"
                stroke="#3b82f6"
                name="Cantidad pedidos"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Top productos
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={productosTop ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="nombre" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="ingresos" fill="#f97316" name="Ingresos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Pedidos por estado
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pedidosEstado ?? []}
                dataKey="cantidad"
                nameKey="estado_codigo"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry: any) => `${entry.estado_codigo}: ${entry.cantidad}`}
              >
                {(pedidosEstado ?? []).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORES_ESTADO[entry.estado_codigo] ?? "#94a3b8"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Ingresos por forma de pago
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ingresos ?? []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="forma_pago_codigo"
                tick={{ fontSize: 11 }}
                width={100}
              />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}