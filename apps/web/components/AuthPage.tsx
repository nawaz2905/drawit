"use client";

import { useState } from "react";
import { api } from "../lib/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Loader2, ArrowRight, Paintbrush, AlertCircle, Github } from "lucide-react";
import { signIn } from "next-auth/react";

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
                const response = await api.post("/signin", {
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
                const response = await api.post("/signup", {
                    email,
                    password,
                    name,
                });
                if (!response?.data?.token) {
                    setError("Something went wrong");
                    return;
                }
                localStorage.setItem("token", response.data.token);
                router.push("/room");
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

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-800"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-zinc-900/40 px-2 text-zinc-500 font-bold tracking-widest backdrop-blur-sm">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => signIn("google", { callbackUrl: `/auth/callback?intent=${isSignin ? "signin" : "signup"}` })}
                            className="flex items-center justify-center gap-3 py-3 px-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800/50 transition-all font-medium text-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Google
                        </motion.button>
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => signIn("github", { callbackUrl: `/auth/callback?intent=${isSignin ? "signin" : "signup"}` })}
                            className="flex items-center justify-center gap-3 py-3 px-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800/50 transition-all font-medium text-sm"
                        >
                            <Github className="w-5 h-5" />
                            GitHub
                        </motion.button>
                    </div>

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
