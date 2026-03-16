"use client";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { useRouter } from "next/navigation";
import { WS_URL } from "../lib/socket";
import { motion } from "framer-motion";
import { Paintbrush, AlertTriangle, RefreshCw } from "lucide-react";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Redirecting to sign in…");
      setTimeout(() => router.push("/signin"), 1800);
      return;
    }

    setError(null);
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    setSocket(ws);
    setIsConnected(false);

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({ type: "join_room", roomId: Number(roomId) }));
    };
    ws.onerror = () => {
      setIsConnected(false);
      setError("Failed to connect to the drawing server.");
    };
    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [roomId, router, retryKey]);

  /* ── Error State ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-5 max-w-sm w-full mx-4 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-1">Connection Failed</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => setRetryKey((k) => k + 1)}
            className="flex items-center gap-2 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-xl text-sm font-semibold transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── Loading State ── */
  if (!socket) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        {/* bg glow */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-blue-600/8 blur-[120px] rounded-full" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-5 z-10"
        >
          {/* Pulsing icon */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20"
          >
            <Paintbrush className="w-8 h-8 text-white" />
          </motion.div>

          <div className="text-center">
            <p className="text-white font-semibold mb-1">Preparing your canvas…</p>
            <p className="text-zinc-500 text-sm">Room {roomId}</p>
          </div>

          {/* Animated dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-blue-500"
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <Canvas roomId={Number(roomId)} socket={socket} isConnected={isConnected} />
    </div>
  );
}
