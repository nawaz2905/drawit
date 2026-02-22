"use client";
import { IconButton } from "./Icons";
import { useGame } from "../draw/newcalls";
import { Circle, Pencil, Square, Hand, Eraser, MousePointer2, LogIn } from "lucide-react";
import { motion } from "framer-motion";

type Shape = "circle" | "rect" | "pencil" | "hand" | "eraser";

export function Canvas({
    roomId,
    socket
}: {
    roomId: number;
    socket: WebSocket;
}) {
    const { bgCanvasRef, topCanvasRef, selectedTool, setSelectedTool } = useGame(roomId, socket);

    return (
        <div className="h-screen w-screen overflow-hidden bg-zinc-50 relative" >
            {/* Canvas Grid Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40"
                style={{
                    backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            />

            <canvas
                ref={bgCanvasRef}
                className="absolute inset-0 z-10 w-full h-full block"
            />

            <canvas
                ref={topCanvasRef}
                className="absolute inset-0 z-20 w-full h-full block cursor-crosshair"
            />

            <TopBar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />

            {/* Context Info Overlay */}
            <div className="fixed bottom-6 right-6 z-20 px-4 py-2 bg-white/80 backdrop-blur-md border border-zinc-200 rounded-full shadow-lg flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-zinc-600 tracking-wide uppercase">Room ID: {roomId}</span>
            </div>
        </div>
    )
}

export function TopBar({
    selectedTool,
    setSelectedTool,
}: {
    selectedTool: Shape;
    setSelectedTool: (tool: Shape) => void;
}) {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-20 p-1.5 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl flex items-center gap-1.5"
        >
            <div className="px-3 py-1.5 mr-1 border-r border-zinc-800 hidden sm:flex items-center gap-2">
                <MousePointer2 className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tools</span>
            </div>

            <IconButton
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
                icon={<Square className="w-5 h-5" />}
                onClick={() => setSelectedTool("rect")}
                activated={selectedTool === "rect"}
            />

            <IconButton
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
                icon={<Circle className="w-5 h-5" />}
                onClick={() => setSelectedTool("circle")}
                activated={selectedTool === "circle"}
            />

            <IconButton
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
                icon={<Pencil className="w-5 h-5" />}
                onClick={() => setSelectedTool("pencil")}
                activated={selectedTool === "pencil"}
            />

            <IconButton
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
                icon={<Hand className="w-5 h-5" />}
                onClick={() => setSelectedTool("hand")}
                activated={selectedTool === "hand"}
            />

            <IconButton
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
                icon={<Eraser className="w-5 h-5" />}
                onClick={() => setSelectedTool("eraser")}
                activated={selectedTool === "eraser"}
            />

            <div className="w-px h-6 bg-zinc-800 mx-1" />

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "/room"}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-red-500/20"
            >
                <LogIn className="w-4 h-4 rotate-180" />
                Leave
            </motion.button>
        </motion.div>
    )
}
