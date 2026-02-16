"use client";
import { ReactNode } from "react"
import { motion } from "framer-motion";

export function IconButton({
    icon,
    onClick,
    activated,
    selectedTool,
    setSelectedTool
}: {
    icon: ReactNode;
    onClick: () => void;
    activated: boolean;
    selectedTool: any;
    setSelectedTool: any;
}) {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${activated
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
        >
            {icon}
        </motion.button>
    )
}