import { create } from "zustand";

interface WsState {
  connected: boolean;
  lastEvent: Record<string, unknown> | null;
  setConnected: (connected: boolean) => void;
  setLastEvent: (event: Record<string, unknown>) => void;
}

export const useWsStore = create<WsState>((set) => ({
  connected: false,
  lastEvent: null,
  setConnected: (connected) => set({ connected }),
  setLastEvent: (event) => set({ lastEvent: event }),
}));