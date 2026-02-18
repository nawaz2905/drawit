"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Paintbrush, Users, Zap, Layout, ChevronRight, Github } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <Paintbrush className="w-6 h-6 text-blue-400" />,
      title: "Smooth Drawing",
      description: "Low-latency drawing experience with customizable tools."
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: "Real-time Collaboration",
      description: "Draw together with your team in real-time from anywhere."
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Instant Rooms",
      description: "Create or join rooms instantly with a simple slug."
    },
    {
      icon: <Layout className="w-6 h-6 text-emerald-400" />,
      title: "Intuitive UI",
      description: "Clean, modern interface designed for focus and creativity."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(#1e40af 0.5px, transparent 0.5px), radial-gradient(#1e40af 0.5px, black 0.5px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        }}
      />

      {/* Decorative Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Paintbrush className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">DrawIt</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors cursor-pointer">Features</a>
            <a href="/signin" className="hover:text-white transition-colors">Sign In</a>
            <a href="/signup" className="px-5 py-2.5 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors">Sign Up</a>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-20 pb-16 md:pt-32 md:pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
              Collaborative <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Visual Thinking
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
              The simplest way to draw, collaborate, and share ideas in real-time.
              Beautiful, fast, and completely free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.push("/signup")}
                className="group w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all active:scale-[0.98]"
              >
                Start Drawing Free
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 border border-zinc-800 hover:bg-zinc-800 transition-all active:scale-[0.98]"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>
          </motion.div>

          {/* Canvas Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 relative p-1 rounded-[2rem] bg-gradient-to-b from-zinc-700 to-transparent shadow-2xl"
          >
            <div className="bg-zinc-950 rounded-[1.8rem] overflow-hidden border border-zinc-800 aspect-[16/9] flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <motion.div
                  className="w-32 h-32 md:w-64 md:h-64 border-2 border-dashed border-blue-500/50 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Paintbrush className="w-12 h-12 text-blue-500/50" />
                </motion.div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full flex items-center gap-4 shadow-xl">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><Layout className="w-4 h-4 text-blue-400" /></div>
                  <div className="w-8 h-8 rounded-full bg-zinc-800" />
                  <div className="w-8 h-8 rounded-full bg-zinc-800" />
                  <div className="w-8 h-8 rounded-full bg-zinc-800" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2 grayscale opacity-50">
            <div className="w-6 h-6 bg-white rounded-lg" />
            <span className="text-sm font-bold">DrawIt</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2026 DrawIt. Built for creators.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </footer>
      </main>
    </div>
  );
}