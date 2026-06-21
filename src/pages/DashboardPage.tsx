import { useAuthStore } from "../store/authStore";
import { authService } from "../features/auth/authService";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <p className="text-slate-600">
          Hola, <span className="font-semibold">{usuario?.nombre} {usuario?.apellido}</span>
        </p>
        <p className="text-slate-400 text-sm mt-1">{usuario?.email}</p>
      </div>
    </div>
  );
}