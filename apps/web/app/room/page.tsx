"use client";

import { useState } from "react";
import {api} from '../../lib/api' 
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Plus, ArrowRight, Paintbrush, AlertCircle, Loader2 } from "lucide-react";

function Room() {
    const [slug, setSlug] = useState("");
    const [slugCreate, setSlugCreate] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"join" | "create">("join");
    const router = useRouter();

    async function handleEnterRoom() {
        if (!slug) {
            setError("Please enter a room slug");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await api.get(`/room/slug/${slug}`);
            const roomId = response.data.id;

            if (!roomId) {
                setError("Room not found - slug '" + slug + "' does not exist");
                return;
            }
            router.push(`/canvas/${roomId}`);
        } catch (err: any) {
            console.error("Error:", err);
            setError(err.response?.data?.error || "Room not found or server error");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateRoom() {
        if (!slugCreate) {
            setError("Please enter a room slug");
            return;
        }
        setLoadingCreate(true);
        setError("");
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please login to create a room");
            setLoadingCreate(false);
            return;
        }
        try {
            const decoded = jwtDecode<{ userId?: string }>(token);
            if (!decoded || !decoded.userId) {
                setError("Invalid token. Please login again.");
                setLoadingCreate(false);
                return;
            }
            const userId = decoded.userId;
            const response = await api.post(`/createroom/${slugCreate}`, {
                adminId: userId,
            })
            const roomId = response.data.roomId;
            router.push(`/canvas/${roomId}`);
        } catch (err: any) {
            console.error("Error", err);
            setError(err.response?.data?.error || "Failed to create room");
        } finally {
            setLoadingCreate(false);
        }
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full z-0" />

            {/* Logout Button */}
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20">
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/signin");
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-xs sm:text-sm font-medium"
                >
                    <LogIn className="w-4 h-4 rotate-180" />
                    <span className="hidden xs:inline">Log Out</span>
                    <span className="xs:hidden">Out</span>
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-lg"
            >
                {/* Logo/Title Area */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-6 group hover:scale-110 transition-transform">
                        <Paintbrush className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Workspace</h1>
                    <p className="text-zinc-400">Join a collaborative canvas or create your own</p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    {/* Tabs */}
                    <div className="flex p-2 bg-zinc-950/50 m-4 rounded-2xl border border-zinc-800/50">
                        <button
                            onClick={() => setActiveTab("join")}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "join"
                                ? "bg-white text-black shadow-lg"
                                : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            <LogIn className="w-4 h-4" />
                            Join Room
                        </button>
                        <button
                            onClick={() => setActiveTab("create")}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "create"
                                ? "bg-white text-black shadow-lg"
                                : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            <Plus className="w-4 h-4" />
                            Create Room
                        </button>
                    </div>

                    <div className="p-8 pt-4">
                        <AnimatePresence mode="wait">
                            {activeTab === "join" ? (
                                <motion.div
                                    key="join"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Room Slug</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="e.g. creative-studio"
                                                value={slug}
                                                onChange={(e) => setSlug(e.target.value)}
                                                className="w-full px-6 py-4 bg-zinc-950 text-white rounded-2xl border border-zinc-800 focus:border-blue-500 focus:outline-none transition-all placeholder:text-zinc-700"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors">
                                                <LogIn className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleEnterRoom}
                                        disabled={loading || !slug}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Join Workspace"}
                                        {!loading && <ArrowRight className="w-5 h-5" />}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="create"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">New Room Name</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="e.g. project-x"
                                                value={slugCreate}
                                                onChange={(e) => setSlugCreate(e.target.value)}
                                                className="w-full px-6 py-4 bg-zinc-950 text-white rounded-2xl border border-zinc-800 focus:border-purple-500 focus:outline-none transition-all placeholder:text-zinc-700"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-purple-500 transition-colors">
                                                <Plus className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCreateRoom}
                                        disabled={loadingCreate || !slugCreate}
                                        className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        {loadingCreate ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Workspace"}
                                        {!loadingCreate && <Plus className="w-5 h-5" />}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Optional back link */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => router.push("/")}
                        className="text-zinc-500 hover:text-white transition-colors text-sm font-medium"
                    >
                        Back to landing page
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
export default Room;
