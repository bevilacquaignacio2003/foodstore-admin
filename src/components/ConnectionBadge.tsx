import { Wifi, WifiOff } from "lucide-react";
import { useWsStore } from "../store/wsStore";

export function ConnectionBadge() {
  const connected = useWsStore((s) => s.connected);

  return (
    <span
      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
        connected
          ? "bg-green-100 text-green-700"
          : "bg-slate-200 text-slate-500"
      }`}
    >
      {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
      {connected ? "En vivo" : "Sin conexión en tiempo real"}
    </span>
  );
}