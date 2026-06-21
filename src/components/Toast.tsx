import { useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

export interface ToastData {
  id: number;
  message: string;
  type: "error" | "success";
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: number) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const isError = toast.type === "error";

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm ${
        isError ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"
      }`}
    >
      {isError ? (
        <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
      ) : (
        <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
      )}
      <p className={`text-sm flex-1 ${isError ? "text-red-700" : "text-green-700"}`}>
        {toast.message}
      </p>
      <button
        onClick={() => onClose(toast.id)}
        className={isError ? "text-red-400 hover:text-red-600" : "text-green-400 hover:text-green-600"}
      >
        <X size={14} />
      </button>
    </div>
  );
}