import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Trash2, Plus, AlertTriangle } from "lucide-react";
import { ingredienteService } from "./ingredienteService";
import { IngredienteForm } from "./IngredienteForm";
import { Modal } from "../../components/Modal";
import { notifyError, notifySuccess } from "../../store/toastStore";
import type { Ingrediente } from "../../types";

export function IngredientesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIngrediente, setEditingIngrediente] = useState<Ingrediente | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["ingredientes", search],
    queryFn: () => ingredienteService.list({ search: search || undefined, limit: 50 }),
  });

  const createIngrediente = useMutation({
    mutationFn: ingredienteService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      setModalOpen(false);
      notifySuccess("Ingrediente creado correctamente");
    },
    onError: (err: any) => {
      notifyError(err.response?.data?.detail || "Error al crear el ingrediente");
    },
  });

  const updateIngrediente = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      ingredienteService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      setModalOpen(false);
      setEditingIngrediente(null);
      notifySuccess("Ingrediente actualizado correctamente");
    },
    onError: (err: any) => {
      notifyError(err.response?.data?.detail || "Error al actualizar el ingrediente");
    },
  });

  const deleteIngrediente = useMutation({
    mutationFn: (id: number) => ingredienteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      notifySuccess("Ingrediente eliminado");
    },
    onError: (err: any) => {
      notifyError(err.response?.data?.detail || "Error al eliminar el ingrediente");
    },
  });

  const handleDelete = (id: number, nombre: string) => {
    if (confirm(`¿Eliminar el ingrediente "${nombre}"?`)) {
      deleteIngrediente.mutate(id);
    }
  };

  const handleOpenCreate = () => {
    setEditingIngrediente(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (ingrediente: Ingrediente) => {
    setEditingIngrediente(ingrediente);
    setModalOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingIngrediente) {
      updateIngrediente.mutate({ id: editingIngrediente.id, data });
    } else {
      createIngrediente.mutate(data);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Ingredientes</h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Nuevo ingrediente
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar ingredientes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm mb-4 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Alérgeno</th>
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

            {data?.items.map((ingrediente) => (
              <tr key={ingrediente.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-700">
                  {ingrediente.nombre}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {ingrediente.descripcion || "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {ingrediente.stock_cantidad}
                </td>
                <td className="px-4 py-3">
                  {ingrediente.es_alergeno ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full w-fit">
                      <AlertTriangle size={12} />
                      Alérgeno
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleOpenEdit(ingrediente)}
                    className="p-1.5 text-slate-400 hover:text-blue-500"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(ingrediente.id, ingrediente.nombre)}
                    className="p-1.5 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {!isLoading && data?.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No hay ingredientes todavía
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIngrediente ? "Editar ingrediente" : "Nuevo ingrediente"}
      >
        <IngredienteForm
          ingrediente={editingIngrediente}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={createIngrediente.isPending || updateIngrediente.isPending}
        />
      </Modal>
    </div>
  );
}