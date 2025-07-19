// src/app/nx-admin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
  
    console.log("Submitting login request...")
  
    const res = await fetch('/api/nx-admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    })
  
    console.log("Response received:", res)
  
    const data = await res.json()
    console.log("Parsed data:", data)
  
    if (res.ok) {
      setSuccess(true)
      localStorage.setItem('user', JSON.stringify(data.user))
      setTimeout(() => {
        router.push('/nx-admin/dashboard')
      }, 2000)
    } else {
      setError(data.error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 -mb-24">
      <img
        src="/logo-nexus.png"
        alt="Nexus Club Logo"
        className="w-100 mb-4 -mt-10 "
      />
      <h1 className="text-4xl mb-6 text-glow">Nexus Admin Login</h1>

      {success && (
        <p className="text-green-500">Login successful, redirecting...</p>
      )}

      <form
        onSubmit={handleLogin}
        className="space-y-4 bg-gradient-to-br from-primary to-accent p-8 rounded-xl shadow-glow w-full max-w-sm"
      >
        <input
          type="text"
          placeholder="username (name+role)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded bg-background text-white border border-glow"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-background text-white border border-glow"
        />
        {error && <p className="text-red-400">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-background text-white border amber-50 rounded bg-glow font-bold hover:bg-amber-50 hover:text-black transition-transform"
        >
          Login
        </button>
      </form>
    </div>
  );
}
