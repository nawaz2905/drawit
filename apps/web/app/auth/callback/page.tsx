"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../../lib/api";
import { Loader2, Paintbrush, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function AuthCallbackContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const intent = searchParams.get("intent"); // "signup" | "signin" | null
    const [processed, setProcessed] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (status === "authenticated" && session?.user && !processed) {
            const syncUser = async () => {
                try {
                    console.log("OAuth session:", JSON.stringify(session.user));
                    const response = await api.post("/oauth-login", {
                        email: session.user?.email,
                        name: session.user?.name,
                        provider: (session.user as any).provider ?? "oauth"
                    });

                    const { token } = response.data;

                    if (token) {
                        localStorage.setItem("token", token);
                        setProcessed(true);
                        router.push("/room");
                    } else {
                        setErrorMsg("Backend did not return a token.");
                    }
                } catch (error: any) {
                    const msg = error?.response?.data?.message || error?.message || "Unknown error";
                    console.error("Failed to sync OAuth user:", msg);
                    setErrorMsg(msg);
                }
            };
            syncUser();
        } else if (status === "unauthenticated") {
            router.push("/signin");
        }
    }, [status, session, router, processed, intent]);

    if (errorMsg) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 gap-4 text-white">
                <div className="flex items-center gap-3 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 max-w-md text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                        <p className="font-bold mb-1">Account already exists</p>
                        <p>{errorMsg}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push("/signin")}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all"
                    >
                        Go to Sign In
                    </button>
                    <button
                        onClick={() => router.push("/signup")}
                        className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-all"
                    >
                        Back to Sign Up
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6"
            >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                    <Paintbrush className="w-8 h-8 text-white" />
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Connecting Account</h2>
                    <p className="text-zinc-500 text-sm">Please wait while we sync your session...</p>
                </div>

                <div className="flex items-center gap-2 text-blue-500 font-medium bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs uppercase tracking-widest">Authentication</span>
                </div>
            </motion.div>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
