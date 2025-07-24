"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function EnhancedLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unknown error");
      } else {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/nx-admin/dashboard";
        }, 1500);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute w-[30rem] h-[30rem] bg-purple-500/30 rounded-full blur-[180px] -z-10 top-[-10%] left-[-10%]" />
      <div className="absolute w-[30rem] h-[30rem] bg-blue-500/20 rounded-full blur-[180px] -z-10 bottom-[-10%] right-[-10%]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-1">
            Nexus Admin
          </h1>
          <p className="text-gray-400">Administrator Portal</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <p className="text-emerald-400 font-medium">
                Login successful! Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={handleLogin}
          className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6"
        >
          {/* Username Field */}
          <div className="relative">
            <User className="absolute top-4 left-4 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute top-4 left-4 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Protected and Powered by{" "}
            <span className="text-purple-400 font-medium">Nexus Dev Departement</span>
          </p>
        </div>
      </div>
    </div>
  );
}
