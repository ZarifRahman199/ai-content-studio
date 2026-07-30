"use client";

import { useState, useEffect } from "react";
import { Landing } from "@/components/landing";
import { Dashboard } from "@/components/dashboard";
import { AuthModal } from "@/components/auth-modal";

interface User {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  plan: string;
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => setUser(null);

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  };

  const openSignup = () => {
    setAuthMode("signup");
    setAuthOpen(true);
  };

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center animate-pulse">
            <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.912 5.813h6.112l-4.958 3.523 1.912 5.813L12 14.626l-4.978 3.523 1.912-5.813L3.976 8.813h6.112z"/></svg>
          </div>
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <>
      <Landing onGetStarted={openSignup} onLogin={openLogin} />
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === "login" ? "signup" : "login")}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}