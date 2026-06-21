import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { productoService } from "./productoService";
import { ProductoForm } from "./ProductoForm";
import { Modal } from "../../components/Modal";
import type { Producto } from "../../types";

export function ProductosPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["productos", search],
    queryFn: () => productoService.list({ search: search || undefined, limit: 50 }),
  });

  const createProducto = useMutation({
    mutationFn: productoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setModalOpen(false);
    },
  });

  const updateProducto = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      productoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setModalOpen(false);
      setEditingProducto(null);
    },
  });

  const toggleDisponibilidad = useMutation({
    mutationFn: ({ id, disponible }: { id: number; disponible: boolean }) =>
      productoService.updateDisponibilidad(id, disponible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  const deleteProducto = useMutation({
    mutationFn: (id: number) => productoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  const handleDelete = (id: number, nombre: string) => {
    if (confirm(`¿Eliminar el producto "${nombre}"?`)) {
      deleteProducto.mutate(id);
    }
  };

  const handleOpenCreate = () => {
    setEditingProducto(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setModalOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingProducto) {
      updateProducto.mutate({ id: editingProducto.id, data });
    } else {
      createProducto.mutate(data);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Productos</h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar productos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm mb-4 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Disponible</th>
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

            {data?.items.map((producto) => (
              <tr key={producto.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-700">
                  {producto.nombre}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  ${producto.precio_base.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {producto.stock_cantidad}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      toggleDisponibilidad.mutate({
                        id: producto.id,
                        disponible: !producto.disponible,
                      })
                    }
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      producto.disponible
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {producto.disponible ? "Disponible" : "No disponible"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleOpenEdit(producto)}
                    className="p-1.5 text-slate-400 hover:text-blue-500"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(producto.id, producto.nombre)}
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
                  No hay productos todavía
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProducto ? "Editar producto" : "Nuevo producto"}
      >
        <ProductoForm
          producto={editingProducto}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={createProducto.isPending || updateProducto.isPending}
        />
      </Modal>
    </div>
  );
}