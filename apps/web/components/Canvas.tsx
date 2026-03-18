"use client";
import { useRef, useState } from "react";
import { IconButton } from "./Icons";
import { useGame } from "../draw/newcalls";
import {
  Circle,
  Pencil,
  Square,
  Hand,
  Eraser,
  MousePointer2,
  LogIn,
  Undo2,
  Redo2,
  Type,
  Palette,
  Minus,
  AlignJustify,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    lineWidth,
    setLineWidth,
    undo,
    redo,
  } = useGame(roomId, socket);

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-50 relative">
      {/* Canvas Grid Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <canvas ref={bgCanvasRef} className="absolute inset-0 z-10 w-full h-full block" />
      <canvas ref={topCanvasRef} className="absolute inset-0 z-20 w-full h-full block cursor-crosshair" />

      <TopBar
        setSelectedTool={setSelectedTool}
        selectedTool={selectedTool}
        undo={undo}
        redo={redo}
      />

      {/* Palette toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed left-5 top-6 z-30 w-10 h-10 flex items-center justify-center rounded-xl border shadow-lg transition-all ${
          isSidebarOpen
            ? "bg-zinc-800 border-zinc-700 text-white"
            : "bg-zinc-900/90 backdrop-blur-xl border-zinc-800 text-zinc-400 hover:text-white"
        }`}
        title="Toggle Color Palette"
      >
        <Palette className="w-5 h-5" />
      </motion.button>

      <Sidebar
        isOpen={isSidebarOpen}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        boardColor={boardColor}
        setBoardColor={setBoardColor}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
      />

      {/* Connection indicator */}
      <div className="fixed bottom-4 right-4 z-20 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/80 backdrop-blur-md border border-zinc-200 rounded-full shadow-lg flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
          }`}
        />
        <span className="text-[10px] sm:text-[11px] font-bold text-zinc-600 tracking-wide uppercase">
          <span className="hidden xs:inline">{isConnected ? `Room ${roomId}` : "Connecting…"}</span>
          <span className="xs:hidden">{isConnected ? roomId : "…"}</span>
        </span>
      </div>
    </div>
  );
}

/* ── Sidebar ── */
function Sidebar({
  isOpen,
  strokeColor,
  setStrokeColor,
  boardColor,
  setBoardColor,
  lineWidth,
  setLineWidth,
}: {
  isOpen: boolean;
  strokeColor: string;
  setStrokeColor: (c: string) => void;
  boardColor: string;
  setBoardColor: (c: string) => void;
  lineWidth: number;
  setLineWidth: (w: number) => void;
}) {
  const customStrokeRef = useRef<HTMLInputElement>(null);
  const customBoardRef = useRef<HTMLInputElement>(null);

  const boardColors = [
    { name: "Dark Canvas", value: "#0a0a0f" },
    { name: "Navy", value: "#0a0a2c" },
    { name: "Dark Brown", value: "#3d2b1f" },
    { name: "Forest", value: "#0a1f0a" },
    { name: "White", value: "#ffffff" },
    { name: "Parchment", value: "#fdf6e3" },
    { name: "Slate", value: "#1e293b" },
    { name: "Black", value: "#000000" },
  ];

  const strokeColors = [
    { name: "White", value: "#ffffff" },
    { name: "Yellow", value: "#facc15" },
    { name: "Sky Blue", value: "#38bdf8" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Green", value: "#22c55e" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Black", value: "#000000" },
    { name: "Gray", value: "#6b7280" },
  ];

  const widths = [
    { label: "Thin", icon: <Minus className="w-4 h-4" />, value: 2 },
    { label: "Mid", icon: <AlignJustify className="w-4 h-4" />, value: 4 },
    { label: "Thick", icon: <AlignJustify className="w-5 h-5 scale-y-150" />, value: 8 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="sidebar"
          initial={{ x: -240, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -240, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 35 }}
          className="fixed left-4 sm:left-5 top-20 z-20 w-[calc(100vw-2rem)] sm:w-44 p-3 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl flex flex-col gap-3"
        >
          {/* Board Color */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">Board</p>
            <div className="grid grid-cols-4 gap-1">
              {boardColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setBoardColor(c.value)}
                  title={c.name}
                  className={`w-7 h-7 rounded-md border-2 transition-all duration-150 ${
                    boardColor === c.value
                      ? "border-blue-500 scale-110 shadow-[0_0_6px_rgba(59,130,246,0.5)]"
                      : "border-zinc-700 hover:border-zinc-500 hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
              {/* Custom board color */}
              <button
                onClick={() => customBoardRef.current?.click()}
                title="Custom color"
                className="w-7 h-7 rounded-md border-2 border-dashed border-zinc-600 hover:border-zinc-400 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-all hover:scale-105"
              >
                <span className="text-sm leading-none">+</span>
                <input
                  ref={customBoardRef}
                  type="color"
                  className="sr-only"
                  value={boardColor}
                  onChange={(e) => setBoardColor(e.target.value)}
                />
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-zinc-800" />

          {/* Stroke Color */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">Stroke</p>
            <div className="grid grid-cols-4 gap-1">
              {strokeColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setStrokeColor(c.value)}
                  title={c.name}
                  className={`w-7 h-7 rounded-md border-2 transition-all duration-150 ${
                    strokeColor === c.value
                      ? "border-blue-500 scale-110 shadow-[0_0_6px_rgba(59,130,246,0.5)]"
                      : "border-zinc-700 hover:border-zinc-500 hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
              {/* Custom stroke color */}
              <button
                onClick={() => customStrokeRef.current?.click()}
                title="Custom color"
                className="w-7 h-7 rounded-md border-2 border-dashed border-zinc-600 hover:border-zinc-400 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-all hover:scale-105"
              >
                <span className="text-sm leading-none">+</span>
                <input
                  ref={customStrokeRef}
                  type="color"
                  className="sr-only"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                />
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-zinc-800" />

          {/* Stroke Width */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">Width</p>
            <div className="flex gap-1.5">
              {widths.map((w) => (
                <button
                  key={w.value}
                  onClick={() => setLineWidth(w.value)}
                  title={w.label}
                  className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 rounded-lg border text-[9px] font-bold uppercase transition-all ${
                    lineWidth === w.value
                      ? "bg-blue-600/20 border-blue-500 text-blue-400"
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  {w.icon}
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── TopBar ── */
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
  const tools: { icon: React.ReactNode; tool: Shape; title: string }[] = [
    { icon: <MousePointer2 className="w-4 h-4" />, tool: "select", title: "Select" },
    { icon: <Square className="w-4 h-4" />, tool: "rect", title: "Rectangle" },
    { icon: <Square className="w-4 h-4 rotate-45" />, tool: "diamond", title: "Diamond" },
    { icon: <Circle className="w-4 h-4" />, tool: "circle", title: "Circle" },
    { icon: <Pencil className="w-4 h-4" />, tool: "pencil", title: "Pencil" },
    { icon: <Hand className="w-4 h-4" />, tool: "hand", title: "Pan" },
    { icon: <Eraser className="w-4 h-4" />, tool: "eraser", title: "Eraser" },
    { icon: <Type className="w-4 h-4" />, tool: "text", title: "Text" },
  ];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 sm:top-5 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-20 flex items-center gap-1 p-1 sm:p-1.5 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl sm:rounded-2xl shadow-2xl overflow-x-auto no-scrollbar"
    >
      {/* Label */}
      <div className="hidden sm:flex items-center gap-1.5 px-2 mr-0.5 border-r border-zinc-800 pr-3">
        <MousePointer2 className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tools</span>
      </div>

      <div className="flex-shrink-0 flex items-center gap-1">
        {tools.map(({ icon, tool, title }) => (
          <IconButton
            key={tool}
            icon={icon}
            onClick={() => setSelectedTool(tool)}
            activated={selectedTool === tool}
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            title={title}
          />
        ))}
      </div>

      <div className="w-px h-5 bg-zinc-800 mx-1 flex-shrink-0" />

      {/* Undo / Redo */}
      <div className="flex-shrink-0 flex items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={undo}
          className="p-1.5 sm:p-2 text-zinc-400 hover:text-white rounded-xl transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={redo}
          className="p-1.5 sm:p-2 text-zinc-400 hover:text-white rounded-xl transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="w-px h-5 bg-zinc-800 mx-1 flex-shrink-0" />

      {/* Leave */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => (window.location.href = "/room")}
        className="flex-shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg sm:rounded-xl transition-all text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-red-500/20"
        title="Leave room"
      >
        <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 rotate-180" />
        <span className="hidden xs:inline">Leave</span>
      </motion.button>
    </motion.div>
  );
}
