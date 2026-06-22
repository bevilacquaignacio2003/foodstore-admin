import { useState, useEffect } from "react";
import type { Ingrediente } from "../../types";

interface IngredienteFormData {
  nombre: string;
  descripcion: string;
  stock_cantidad: number;
  es_alergeno: boolean;
}

interface IngredienteFormProps {
  ingrediente?: Ingrediente | null;
  onSubmit: (data: IngredienteFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

export function IngredienteForm({
  ingrediente,
  onSubmit,
  onCancel,
  loading,
}: IngredienteFormProps) {
  const [form, setForm] = useState<IngredienteFormData>({
    nombre: "",
    descripcion: "",
    stock_cantidad: 0,
    es_alergeno: false,
  });

  useEffect(() => {
    if (ingrediente) {
      setForm({
        nombre: ingrediente.nombre,
        descripcion: ingrediente.descripcion || "",
        stock_cantidad: ingrediente.stock_cantidad,
        es_alergeno: ingrediente.es_alergeno,
      });
    }
  }, [ingrediente]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

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
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Stock
        </label>
        <input
          type="number"
          min="0"
          required
          value={form.stock_cantidad}
          onChange={(e) =>
            setForm({ ...form, stock_cantidad: parseInt(e.target.value) || 0 })
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.es_alergeno}
          onChange={(e) => setForm({ ...form, es_alergeno: e.target.checked })}
          className="rounded border-slate-300"
        />
        Es alérgeno
      </label>

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