import { useState, useEffect } from "react";
import type { Producto } from "../../types";
import { ImageUploader } from "../../components/ImageUploader";

interface ProductoFormData {
  nombre: string;
  descripcion: string;
  precio_base: number;
  stock_cantidad: number;
  disponible: boolean;
  imagenes_url: string[];
}

interface ProductoFormProps {
  producto?: Producto | null;
  onSubmit: (data: ProductoFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

export function ProductoForm({ producto, onSubmit, onCancel, loading }: ProductoFormProps) {
  const [form, setForm] = useState<ProductoFormData>({
    nombre: "",
    descripcion: "",
    precio_base: 0,
    stock_cantidad: 0,
    disponible: true,
    imagenes_url: [],
  });

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre,
        descripcion: producto.descripcion || "",
        precio_base: producto.precio_base,
        stock_cantidad: producto.stock_cantidad,
        disponible: producto.disponible,
        imagenes_url: producto.imagenes_url || [],
      });
    }
  }, [producto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const imagenActual = form.imagenes_url[0] || null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ImageUploader
        imageUrl={imagenActual}
        folder="foodstore/productos"
        onUploaded={(url) => setForm({ ...form, imagenes_url: [url] })}
        onRemoved={() => setForm({ ...form, imagenes_url: [] })}
      />

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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Precio
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={form.precio_base}
            onChange={(e) =>
              setForm({ ...form, precio_base: parseFloat(e.target.value) || 0 })
            }
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
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.disponible}
          onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
          className="rounded border-slate-300"
        />
        Disponible para la venta
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