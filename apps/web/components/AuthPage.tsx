"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Loader2, ArrowRight, Paintbrush, AlertCircle } from "lucide-react";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isSignin) {
                const response = await axios.post("http://localhost:3001/signin", {
                    email,
                    password,
                });
                if (!response) {
                    setError("Something went wrong");
                    return;
                }
                localStorage.setItem("token", response.data.token);
                router.push("/room");
            } else {
                const response = await axios.post("http://localhost:3001/signup", {
                    email,
                    password,
                    name,
                });
                const signinResponse = await axios.post(
                    "http://localhost:3001/signin", {
                    email,
                    password,
                },
                );
                localStorage.setItem("token", signinResponse.data.token);
                router.push("/signin");
            }
        } catch (e: any) {
            setError(e.response?.data?.message || "Authentication failed. Please try again.");
        } finally {
            setLoading(false);
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
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[120px] rounded-full z-0 bg-blue-600/10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/")}
                        className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-6 cursor-pointer"
                    >
                        <Paintbrush className="w-7 h-7 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">
                        {isSignin ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        {isSignin ? "Enter your credentials to access your rooms" : "Join the creative community today"}
                    </p>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="popLayout">
                            {!isSignin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-12 pr-6 py-4 bg-zinc-950/50 text-white rounded-2xl border border-zinc-800 focus:border-purple-500 focus:outline-none transition-all placeholder:text-zinc-700"
                                            required={!isSignin}
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-purple-500 transition-colors">
                                            <User className="w-5 h-5" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-zinc-950/50 text-white rounded-2xl border border-zinc-800 focus:border-blue-500 focus:outline-none transition-all placeholder:text-zinc-700"
                                    required
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-zinc-950/50 text-white rounded-2xl border border-zinc-800 focus:border-blue-500 focus:outline-none transition-all placeholder:text-zinc-700"
                                    required
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${isSignin
                                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                                : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
                                }`}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignin ? "Sign In" : "Create Account")}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
                        <p className="text-zinc-500 text-sm">
                            {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <a
                                href={isSignin ? "/signup" : "/signin"}
                                className="text-white hover:text-blue-400 hover:underline font-bold transition-colors"
                            >
                                {isSignin ? "Sign up" : "Sign in"}
                            </a>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
