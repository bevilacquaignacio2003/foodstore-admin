import { create } from "zustand";
import type { ToastData } from "../components/Toast";

interface ToastState {
  toasts: ToastData[];
  addToast: (message: string, type: "error" | "success") => void;
  removeToast: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type) =>
    set((state) => ({
      toasts: [...state.toasts, { id: nextId++, message, type }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export function notifyError(message: string) {
  useToastStore.getState().addToast(message, "error");
}

export function notifySuccess(message: string) {
  useToastStore.getState().addToast(message, "success");
}