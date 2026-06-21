import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, FolderTree, ClipboardList, Users } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/productos", label: "Productos", icon: Package },
  { to: "/categorias", label: "Categorías", icon: FolderTree },
  { to: "/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/usuarios", label: "Usuarios", icon: Users },
];

export function Sidebar() {
  return (
    <aside className="w-60 bg-slate-900 min-h-screen flex flex-col">
      <div className="px-6 py-5">
        <h1 className="text-white font-bold text-lg">Food Store</h1>
        <p className="text-slate-400 text-xs">Panel de administración</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}