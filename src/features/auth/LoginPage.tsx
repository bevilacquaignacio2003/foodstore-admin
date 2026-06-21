import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "./authService";
import { useAuthStore } from "../../store/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const setUsuario = useAuthStore((s) => s.setUsuario);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      const rolesPermitidos = data.usuario.roles.some((r) =>
        ["ADMIN", "STOCK", "PEDIDOS"].includes(r.codigo)
      );

      if (!rolesPermitidos) {
        setError("No tenés permisos para acceder al panel de administración");
        setLoading(false);
        return;
      }

      setUsuario(data.usuario, data.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(detail || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-800 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-1">Food Store</h1>
        <p className="text-slate-400 text-sm mb-6">Panel de Administración</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="admin@foodstore.com"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium rounded-lg py-2 transition-colors"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}