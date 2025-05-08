"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("../../../components/ui/Scene"), {
  ssr: false,
});

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ username, password });
  };

  return (
    <body  className="bg-black text-white">
      <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29]/40 via-[#302b63]/30 to-[#24243e]/30 backdrop-blur-[2px] z-0" />

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="z-10 w-full max-w-md bg-black/70 border border-cyan-500/30 backdrop-blur-2xl rounded-3xl px-10 py-12 shadow-[0_0_60px_rgba(0,255,255,0.25)]"
        >
          <h1 className="text-center text-4xl font-extrabold text-cyan-300 tracking-widest mb-10 neon-glow">
            NEXUS CONSOLE
          </h1>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm text-cyan-400 uppercase tracking-wide"
              >
                Agent ID
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-cyan-400/40 text-cyan-100 placeholder-cyan-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:border-cyan-300 transition"
                placeholder="alpha.nexus"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm text-cyan-400 uppercase tracking-wide"
              >
                Clearance Key
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-cyan-400/40 text-cyan-100 placeholder-cyan-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:border-cyan-300 transition"
                placeholder="••••••••"
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 font-bold text-black bg-cyan-300 hover:bg-cyan-400 transition-all rounded-xl shadow-[0_0_20px_cyan]"
            >
              Initiate Access
            </motion.button>
          </form>
        </motion.div>
      </div>
    </body>
  );
}
