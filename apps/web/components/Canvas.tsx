"use client";
import { useState } from "react";
import { IconButton } from "./Icons";
import { useGame } from "../draw/newcalls";
import { Circle, Pencil, Square, Hand, Eraser, MousePointer2, LogIn, Undo2, Redo2, Type, Menu } from "lucide-react";
import { motion } from "framer-motion";

type Shape = "circle" | "rect" | "pencil" | "hand" | "eraser" | "text" | "select" | "diamond";

export function Canvas({
    roomId,
    socket,
    isConnected,
}: {
    roomId: number;
    socket: WebSocket;
    isConnected: boolean;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { 
        bgCanvasRef, 
        topCanvasRef, 
        selectedTool, 
        setSelectedTool, 
        strokeColor,
        setStrokeColor,
        boardColor,
        setBoardColor,
        undo, 
        redo 
    } = useGame(roomId, socket);

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

            <TopBar setSelectedTool={setSelectedTool} selectedTool={selectedTool} undo={undo} redo={redo} />

            {/* Color Palette Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed left-6 top-6 z-30 p-2.5 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-lg text-zinc-400 hover:text-white transition-colors"
                title="Toggle Color Palette"
            >
                <Menu className="w-5 h-5" />
            </button>
            
            <Sidebar 
                isOpen={isSidebarOpen}
                strokeColor={strokeColor} 
                setStrokeColor={setStrokeColor} 
                boardColor={boardColor} 
                setBoardColor={setBoardColor} 
            />

            {/* Context Info Overlay */}
            <div className="fixed bottom-6 right-6 z-20 px-4 py-2 bg-white/80 backdrop-blur-md border border-zinc-200 rounded-full shadow-lg flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                <span className="text-xs font-bold text-zinc-600 tracking-wide uppercase">
                    {isConnected ? `Room ID: ${roomId}` : `Connecting room ${roomId}`}
                </span>
            </div>
        </div>
    )
}

function Sidebar({
    isOpen,
    strokeColor,
    setStrokeColor,
    boardColor,
    setBoardColor,
}: {
    isOpen: boolean;
    strokeColor: string;
    setStrokeColor: (color: string) => void;
    boardColor: string;
    setBoardColor: (color: string) => void;
}) {
    const boardColors = [
        { name: "Navy Blue", value: "#0a0a2c" },
        { name: "White", value: "#ffffff" },
        { name: "Black", value: "#000000" },
        { name: "Dark Brown", value: "#3d2b1f" },
    ];

    const strokeColors = [
        { name: "Black", value: "#000000" },
        { name: "Brown", value: "#8b4513" },
        { name: "Blue", value: "#0000ff" },
        { name: "Yellow", value: "#ffff00" },
    ];

    return (
        <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: isOpen ? 0 : -200, opacity: isOpen ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-6 top-1/2 -translate-y-1/2 z-20 p-4 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl flex flex-col gap-6"
        >
            <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">Board Color</span>
                <div className="grid grid-cols-2 gap-2">
                    {boardColors.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => setBoardColor(color.value)}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${boardColor === color.value ? "border-blue-500 scale-110 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "border-zinc-700 hover:border-zinc-500"}`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-zinc-800" />

            <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">Stroke Color</span>
                <div className="grid grid-cols-2 gap-2">
                    {strokeColors.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => setStrokeColor(color.value)}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${strokeColor === color.value ? "border-blue-500 scale-110 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "border-zinc-700 hover:border-zinc-500"}`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export function TopBar({
    selectedTool,
    setSelectedTool,
    undo,
    redo,
}: {
    selectedTool: Shape;
    setSelectedTool: (tool: Shape) => void;
    undo: () => void;
    redo: () => void;
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
                icon={<MousePointer2 className="w-5 h-5" />}
                onClick={() => setSelectedTool("select")}
                activated={selectedTool === "select"}
            />

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
                icon={<Square className="w-5 h-5 rotate-45" />}
                onClick={() => setSelectedTool("diamond")}
                activated={selectedTool === "diamond"}
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

            <IconButton
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
                icon={<Type className="w-5 h-5" />}
                onClick={() => setSelectedTool("text")}
                activated={selectedTool === "text"}
            />

            <div className="w-px h-6 bg-zinc-800 mx-1" />

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={undo}
                className="p-2 text-zinc-400 hover:text-white rounded-xl transition-colors"
                title="Undo (Ctrl+Z)"
            >
                <Undo2 className="w-5 h-5" />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={redo}
                className="p-2 text-zinc-400 hover:text-white rounded-xl transition-colors"
                title="Redo (Ctrl+Y)"
            >
                <Redo2 className="w-5 h-5" />
            </motion.button>

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
