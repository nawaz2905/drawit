"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paintbrush,
  Users,
  Zap,
  Layout,
  ChevronRight,
  Github,
  Plus,
  Share2,
  Pencil,
  Wifi,
  Monitor,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <Paintbrush className="w-5 h-5 text-blue-400" />,
      title: "Smooth Drawing",
      description: "Low-latency drawing experience with customizable tools and colors.",
      gradient: "from-blue-500/10 to-blue-500/5",
      border: "border-blue-500/20 hover:border-blue-500/40",
    },
    {
      icon: <Users className="w-5 h-5 text-purple-400" />,
      title: "Real-time Collaboration",
      description: "Draw together with your team in real-time from anywhere on earth.",
      gradient: "from-purple-500/10 to-purple-500/5",
      border: "border-purple-500/20 hover:border-purple-500/40",
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      title: "Instant Rooms",
      description: "Create or join rooms instantly — no setup, no downloads needed.",
      gradient: "from-yellow-500/10 to-yellow-500/5",
      border: "border-yellow-500/20 hover:border-yellow-500/40",
    },
    {
      icon: <Layout className="w-5 h-5 text-emerald-400" />,
      title: "Intuitive Interface",
      description: "Clean, modern interface built for focus, creativity, and speed.",
      gradient: "from-emerald-500/10 to-emerald-500/5",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
    },
  ];

  const steps = [
    {
      icon: <Plus className="w-5 h-5" />,
      step: "01",
      title: "Create a Room",
      description: "Give your canvas a unique name and it's instantly ready.",
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/30",
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      step: "02",
      title: "Invite Your Team",
      description: "Share the room slug. Anyone can join instantly.",
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
    },
    {
      icon: <Pencil className="w-5 h-5" />,
      step: "03",
      title: "Draw Together",
      description: "See every stroke in real-time — zero lag, total sync.",
      color: "text-pink-400",
      bg: "bg-pink-500/10 border-pink-500/30",
    },
  ];

  const stats = [
    { icon: <Wifi className="w-4 h-4 text-emerald-400" />, label: "Real-time sync" },
    { icon: <Monitor className="w-4 h-4 text-blue-400" />, label: "Any device" },
    { icon: <Heart className="w-4 h-4 text-pink-400" />, label: "Free forever" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Grid Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(rgba(59,130,246,0.12) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Decorative Glows */}
      <div className="fixed top-[-15%] left-[-5%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full z-0 pointer-events-none" />
      <div className="fixed bottom-[-15%] right-[-5%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full z-0 pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-7 relative z-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Paintbrush className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight">DrawIt</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-zinc-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how" className="text-zinc-400 hover:text-white transition-colors">
              How it works
            </a>
            <a href="/signin" className="text-zinc-400 hover:text-white transition-colors">
              Sign In
            </a>
            <a
              href="/signup"
              className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-100 transition-colors"
            >
              Sign Up
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Mobile Nav Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full left-0 right-0 mt-2 p-6 bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800 rounded-2xl md:hidden flex flex-col gap-4 shadow-2xl z-50"
              >
                <a
                  href="#features"
                  className="text-lg font-bold text-zinc-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how"
                  className="text-lg font-bold text-zinc-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it works
                </a>
                <div className="h-px bg-zinc-800 my-2" />
                <a
                  href="/signin"
                  className="text-lg font-bold text-zinc-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="w-full py-4 bg-white text-black text-center font-black rounded-xl hover:bg-zinc-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Drawing Free
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ── Hero Section ── */}
        <div className="pt-20 pb-12 md:pt-28 md:pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Live collaboration · Zero setup
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter mb-6 leading-[1.05]">
              Collaborative <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Visual Thinking
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-base md:text-lg text-zinc-400 mb-8 leading-relaxed">
              The simplest way to draw, collaborate, and share ideas in real-time.
              Beautiful, fast, and completely free.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <button
                onClick={() => router.push("/signup")}
                className="group w-full sm:w-auto px-7 py-3.5 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all active:scale-[0.98]"
              >
                Start Drawing Free
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://github.com/nawaz2905/drawit"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 bg-zinc-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 border border-zinc-800 hover:bg-zinc-800 transition-all active:scale-[0.98]"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-zinc-500">
                  {stat.icon}
                  <span>{stat.label}</span>
                  {i < stats.length - 1 && (
                    <span className="ml-3 w-px h-4 bg-zinc-800 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Animated Canvas Mockup ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-16 relative"
          >
            {/* Glow behind mockup */}
            <div className="absolute inset-x-10 top-10 bottom-0 bg-gradient-to-b from-blue-600/10 via-purple-600/8 to-transparent blur-3xl -z-10 rounded-full" />

            <div className="p-px rounded-[1.75rem] bg-gradient-to-b from-zinc-700/60 to-transparent shadow-2xl">
              <div className="bg-zinc-950 rounded-[1.7rem] overflow-hidden border border-zinc-800/50">
                {/* Fake toolbar */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-800/60 bg-zinc-900/60 backdrop-blur-md">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-2 px-6 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
                      {[
                        <Layout key="l" className="w-3.5 h-3.5 text-blue-400" />,
                        <div key="r" className="w-3.5 h-3.5 border border-zinc-500 rounded-sm" />,
                        <div key="c" className="w-3.5 h-3.5 border border-zinc-500 rounded-full" />,
                        <Pencil key="p" className="w-3.5 h-3.5 text-zinc-400" />,
                      ].map((icon, i) => (
                        <div
                          key={i}
                          className={`p-1 rounded-md ${i === 0 ? "bg-blue-600/20" : ""}`}
                        >
                          {icon}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-zinc-500 font-mono hidden sm:block">2 online</span>
                  </div>
                </div>

                {/* Canvas area */}
                <div className="relative aspect-[16/9] bg-zinc-950">
                  {/* Grid */}
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                      backgroundSize: "32px 32px",
                    }}
                  />

                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 800 450"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    {/* Rectangle */}
                    <motion.rect
                      x="120" y="100" width="200" height="140" rx="8"
                      fill="none" stroke="#3b82f6" strokeWidth="2.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    />
                    {/* Circle */}
                    <motion.circle
                      cx="560" cy="180" r="90"
                      fill="none" stroke="#a855f7" strokeWidth="2.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 1.0, duration: 0.9, ease: "easeOut" }}
                    />
                    {/* Diamond */}
                    <motion.polygon
                      points="400,90 470,175 400,260 330,175"
                      fill="none" stroke="#ec4899" strokeWidth="2.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.7, ease: "easeOut" }}
                    />
                    {/* Pencil squiggle */}
                    <motion.path
                      d="M 140 310 Q 200 280 260 310 Q 320 340 380 310 Q 440 280 500 310"
                      fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 2.0, duration: 1.0, ease: "easeOut" }}
                    />
                    {/* Connecting arrow */}
                    <motion.line
                      x1="320" y1="170" x2="465" y2="175"
                      stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 2.5, duration: 0.5 }}
                    />
                    {/* Label text */}
                    <motion.text
                      x="120" y="88" fontSize="11" fill="#6b7280"
                      fontFamily="monospace" fontWeight="600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      Component A
                    </motion.text>
                    <motion.text
                      x="487" y="88" fontSize="11" fill="#6b7280"
                      fontFamily="monospace" fontWeight="600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                    >
                      Component B
                    </motion.text>
                    {/* Cursor 1 */}
                    <motion.g
                      initial={{ opacity: 0, x: 0, y: 0 }}
                      animate={{ opacity: 1, x: [0, 40, 80], y: [0, -20, 10] }}
                      transition={{ delay: 2.0, duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
                    >
                      <polygon points="160,350 164,362 168,355 176,360 163,365" fill="#3b82f6" />
                      <rect x="165" y="364" width="36" height="14" rx="4" fill="#3b82f6" />
                      <text x="168" y="374" fontSize="8" fill="white" fontFamily="sans-serif">Alice</text>
                    </motion.g>
                    {/* Cursor 2 */}
                    <motion.g
                      initial={{ opacity: 0, x: 0, y: 0 }}
                      animate={{ opacity: 1, x: [0, -30, 20], y: [0, 15, -10] }}
                      transition={{ delay: 2.3, duration: 1.8, repeat: Infinity, repeatType: "mirror" }}
                    >
                      <polygon points="550,310 554,322 558,315 566,320 553,325" fill="#a855f7" />
                      <rect x="555" y="323" width="34" height="14" rx="4" fill="#a855f7" />
                      <text x="558" y="333" fontSize="8" fill="white" fontFamily="sans-serif">Bob</text>
                    </motion.g>
                  </svg>

                  {/* Color swatches overlay */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 bg-zinc-900/70 backdrop-blur-md border border-zinc-800 rounded-xl">
                    {["#3b82f6", "#a855f7", "#ec4899", "#facc15", "#22c55e"].map((c) => (
                      <div key={c} className="w-4 h-4 rounded-full border border-white/10" style={{ background: c }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Features ── */}
        <section id="features" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">Everything you need</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Built for creators</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} border ${feature.border} transition-all group cursor-default`}
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-950/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold mb-2">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how" className="py-16 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">Simple by design</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">How It Works</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Dotted connector (desktop) */}
            <div className="hidden md:block absolute top-[2.25rem] left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px border-t border-dashed border-zinc-800 z-0" />
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center p-6"
              >
                <div className={`w-12 h-12 rounded-2xl border ${step.bg} flex items-center justify-center mb-5 ${step.color}`}>
                  {step.icon}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Step {step.step}</p>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-[220px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 p-px rounded-3xl bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-600/40"
        >
          <div className="bg-zinc-950/90 backdrop-blur-xl rounded-3xl p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">
              Ready to draw something great?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Start collaborating in seconds. No credit card, no setup — just ideas.
            </p>
            <button
              onClick={() => router.push("/signup")}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-100 transition-all active:scale-[0.98]"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-10 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
            <span className="text-sm font-bold">DrawIt</span>
          </div>
          <p className="text-zinc-600 text-sm">© 2026 DrawIt. Built for creators.</p>
          <a
            href="https://github.com/nawaz2905/drawit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </footer>
      </main>
    </div>
  );
}
