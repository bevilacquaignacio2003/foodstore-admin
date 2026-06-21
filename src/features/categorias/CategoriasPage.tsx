import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Trash2, Plus, ChevronRight, ImageOff } from "lucide-react";
import { categoriaService } from "./categoriaService";
import { CategoriaForm } from "./CategoriaForm";
import { Modal } from "../../components/Modal";
import { notifyError, notifySuccess } from "../../store/toastStore";
import type { Categoria } from "../../types";

export function CategoriasPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categorias"],
    queryFn: () => categoriaService.list(true),
  });

  const { data: categoriasFlat } = useQuery({
    queryKey: ["categorias-flat"],
    queryFn: () => categoriaService.listFlat(),
  });

  const createCategoria = useMutation({
    mutationFn: categoriaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["categorias-flat"] });
      setModalOpen(false);
      notifySuccess("Categoría creada correctamente");
    },
    onError: (err: any) => {
      notifyError(err.response?.data?.detail || "Error al crear la categoría");
    },
  });

  const updateCategoria = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      categoriaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["categorias-flat"] });
      setModalOpen(false);
      setEditingCategoria(null);
      notifySuccess("Categoría actualizada correctamente");
    },
    onError: (err: any) => {
      notifyError(err.response?.data?.detail || "Error al actualizar la categoría");
    },
  });

  const deleteCategoria = useMutation({
    mutationFn: (id: number) => categoriaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["categorias-flat"] });
      notifySuccess("Categoría eliminada");
    },
    onError: (err: any) => {
      notifyError(err.response?.data?.detail || "Error al eliminar la categoría");
    },
  });

  const handleDelete = (id: number, nombre: string) => {
    if (confirm(`¿Eliminar la categoría "${nombre}"?`)) {
      deleteCategoria.mutate(id);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategoria(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setModalOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingCategoria) {
      updateCategoria.mutate({ id: editingCategoria.id, data });
    } else {
      createCategoria.mutate(data);
    }
  };

  const renderCategoria = (categoria: Categoria, nivel = 0) => (
    <div key={categoria.id}>
      <div
        className="flex items-center justify-between px-4 py-3 border-t border-slate-100 hover:bg-slate-50"
        style={{ paddingLeft: `${16 + nivel * 24}px` }}
      >
        <div className="flex items-center gap-3">
          {nivel > 0 && <ChevronRight size={14} className="text-slate-400" />}
          {categoria.imagen_url ? (
            <img
              src={categoria.imagen_url}
              alt={categoria.nombre}
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300">
              <ImageOff size={14} />
            </div>
          )}
          <span className="font-medium text-slate-700 text-sm">
            {categoria.nombre}
          </span>
          {categoria.descripcion && (
            <span className="text-xs text-slate-400">
              {categoria.descripcion}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => handleOpenEdit(categoria)}
            className="p-1.5 text-slate-400 hover:text-blue-500"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(categoria.id, categoria.nombre)}
            className="p-1.5 text-slate-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {categoria.subcategorias?.map((sub) => renderCategoria(sub, nivel + 1))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Categorías</h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Nueva categoría
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {isLoading && (
          <p className="px-4 py-6 text-center text-slate-400">Cargando...</p>
        )}

        {!isLoading && data?.items.length === 0 && (
          <p className="px-4 py-6 text-center text-slate-400">
            No hay categorías todavía
          </p>
        )}

        {data?.items
          .filter((categoria) => !categoria.parent_id)
          .map((categoria) => renderCategoria(categoria))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategoria ? "Editar categoría" : "Nueva categoría"}
      >
        <CategoriaForm
          categoria={editingCategoria}
          categoriasDisponibles={categoriasFlat || []}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={createCategoria.isPending || updateCategoria.isPending}
        />
      </Modal>
    </div>
  );
}