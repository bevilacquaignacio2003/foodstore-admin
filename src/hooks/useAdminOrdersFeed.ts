import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { useWsStore } from "../store/wsStore";

const WS_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(
  /^http/,
  "ws"
);

const MAX_RECONNECT_DELAY = 30000;

export function useAdminOrdersFeed() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setConnected = useWsStore((s) => s.setConnected);
  const setLastEvent = useWsStore((s) => s.setLastEvent);
  const queryClient = useQueryClient();

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempt = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualClose = useRef(false);

  useEffect(() => {
    if (!accessToken) return;

    manualClose.current = false;

    const connect = () => {
      const ws = new WebSocket(`${WS_URL}/ws/admin/pedidos?token=${accessToken}`);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttempt.current = 0;
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastEvent(data);
          queryClient.invalidateQueries({ queryKey: ["pedidos"] });
          if (data.pedido_id) {
            queryClient.invalidateQueries({ queryKey: ["pedido", data.pedido_id] });
          }
        } catch {
          // ignore malformed payloads
        }
      };

      ws.onclose = () => {
        setConnected(false);
        if (manualClose.current) return;

        const delay = Math.min(
          1000 * 2 ** reconnectAttempt.current,
          MAX_RECONNECT_DELAY
        );
        reconnectAttempt.current += 1;
        reconnectTimer.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      manualClose.current = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
      setConnected(false);
    };
  }, [accessToken, queryClient, setConnected, setLastEvent]);
}