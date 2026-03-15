"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";

export function IconButton({
  icon,
  onClick,
  activated,
  selectedTool,
  setSelectedTool,
  title,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
  selectedTool: any;
  setSelectedTool: any;
  title?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 ${
        activated
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
          : "text-zinc-400 hover:text-white hover:bg-zinc-800"
      }`}
    >
      {icon}
    </motion.button>
  );
}
