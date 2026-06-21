import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authService } from "../features/auth/authService";

export function Header() {
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-800">
            {usuario?.nombre} {usuario?.apellido}
          </p>
          <p className="text-xs text-slate-400">
            {usuario?.roles.map((r) => r.codigo).join(", ")}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-500 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}