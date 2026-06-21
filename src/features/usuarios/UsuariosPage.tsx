import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { usuarioService } from "./usuarioService";
import type { RolCodigo } from "../../types";

const ROLES_DISPONIBLES: RolCodigo[] = ["ADMIN", "STOCK", "PEDIDOS", "CLIENT"];

const COLOR_ROL: Record<RolCodigo, string> = {
  ADMIN: "bg-red-100 text-red-700",
  STOCK: "bg-blue-100 text-blue-700",
  PEDIDOS: "bg-purple-100 text-purple-700",
  CLIENT: "bg-slate-100 text-slate-600",
};

export function UsuariosPage() {
  const queryClient = useQueryClient();
  const [rolFiltro, setRolFiltro] = useState("");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["usuarios", rolFiltro],
    queryFn: () =>
      usuarioService.list({ rol_codigo: rolFiltro || undefined, limit: 50 }),
  });

  const asignarRol = useMutation({
    mutationFn: ({ id, rol }: { id: number; rol: RolCodigo }) =>
      usuarioService.asignarRol(id, rol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });

  const removerRol = useMutation({
    mutationFn: ({ id, rol }: { id: number; rol: RolCodigo }) =>
      usuarioService.removerRol(id, rol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });

  const toggleRol = (
    usuarioId: number,
    rol: RolCodigo,
    tieneRol: boolean
  ) => {
    if (tieneRol) {
      removerRol.mutate({ id: usuarioId, rol });
    } else {
      asignarRol.mutate({ id: usuarioId, rol });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setRolFiltro("")}
          className={`text-sm px-3 py-1.5 rounded-lg font-medium ${
            rolFiltro === ""
              ? "bg-slate-800 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Todos
        </button>
        {ROLES_DISPONIBLES.map((rol) => (
          <button
            key={rol}
            onClick={() => setRolFiltro(rol)}
            className={`text-sm px-3 py-1.5 rounded-lg font-medium ${
              rolFiltro === rol
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {rol}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3">Alta</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  Cargando...
                </td>
              </tr>
            )}

            {data?.items.map((usuario) => {
              const rolesUsuario = usuario.roles.map((r) => r.codigo);
              return (
                <tr key={usuario.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {usuario.nombre} {usuario.apellido}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{usuario.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {usuario.roles.map((rol) => (
                        <span
                          key={rol.codigo}
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${COLOR_ROL[rol.codigo]}`}
                        >
                          {rol.codigo}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {format(new Date(usuario.created_at), "dd/MM/yyyy")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        setEditingUserId(
                          editingUserId === usuario.id ? null : usuario.id
                        )
                      }
                      className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                    >
                      Gestionar roles
                    </button>
                  </td>
                </tr>
              );
            })}

            {editingUserId !== null &&
              data?.items
                .filter((u) => u.id === editingUserId)
                .map((usuario) => {
                  const rolesUsuario = usuario.roles.map((r) => r.codigo);
                  return (
                    <tr key={`edit-${usuario.id}`} className="bg-slate-50">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-slate-500 mr-2">
                            Roles de {usuario.nombre}:
                          </span>
                          {ROLES_DISPONIBLES.map((rol) => {
                            const tieneRol = rolesUsuario.includes(rol);
                            return (
                              <button
                                key={rol}
                                onClick={() =>
                                  toggleRol(usuario.id, rol, tieneRol)
                                }
                                className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                                  tieneRol
                                    ? "bg-orange-500 text-white border-orange-500"
                                    : "bg-white text-slate-500 border-slate-300 hover:border-orange-400"
                                }`}
                              >
                                {rol}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}

            {!isLoading && data?.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No hay usuarios todavía
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}