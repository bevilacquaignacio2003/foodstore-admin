import { useState, useEffect } from "react";
import type { Categoria } from "../../types";

interface CategoriaFormData {
  nombre: string;
  descripcion: string;
  parent_id: number | null;
}

interface CategoriaFormProps {
  categoria?: Categoria | null;
  categoriasDisponibles: Categoria[];
  onSubmit: (data: CategoriaFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

export function CategoriaForm({
  categoria,
  categoriasDisponibles,
  onSubmit,
  onCancel,
  loading,
}: CategoriaFormProps) {
  const [form, setForm] = useState<CategoriaFormData>({
    nombre: "",
    descripcion: "",
    parent_id: null,
  });

  useEffect(() => {
    if (categoria) {
      setForm({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || "",
        parent_id: categoria.parent_id || null,
      });
    }
  }, [categoria]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const opcionesParent = categoriasDisponibles.filter(
    (c) => c.id !== categoria?.id
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Nombre
        </label>
        <input
          type="text"
          required
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Descripción
        </label>
        <textarea
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Categoría padre (opcional)
        </label>
        <select
          value={form.parent_id ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              parent_id: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Sin categoría padre</option>
          {opcionesParent.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}