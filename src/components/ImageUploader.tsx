import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadService } from "../features/uploads/uploadService";

interface ImageUploaderProps {
  imageUrl: string | null;
  onUploaded: (url: string, publicId: string) => void;
  onRemoved: () => void;
  folder?: string;
}

export function ImageUploader({
  imageUrl,
  onUploaded,
  onRemoved,
  folder = "foodstore/productos",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPublicId, setCurrentPublicId] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const result = await uploadService.uploadImagen(file, folder);
      setCurrentPublicId(result.public_id);
      onUploaded(result.secure_url, result.public_id);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al subir la imagen");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (currentPublicId) {
      try {
        await uploadService.deleteImagen(currentPublicId);
      } catch {
        // si falla el delete remoto, igual limpiamos localmente
      }
    }
    setCurrentPublicId(null);
    onRemoved();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Imagen
      </label>

      {imageUrl ? (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-orange-400 hover:text-orange-500 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <Upload size={20} />
              <span className="text-xs">Subir imagen</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}