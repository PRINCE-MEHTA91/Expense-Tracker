"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, ArrowRight, Wallet } from "lucide-react";

export default function LandingPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const activeUser = localStorage.getItem("expenseTracker_activeUser");
    if (activeUser) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleContinue = (e) => {
    e.preventDefault();
    if (!mobileNumber.match(/^[0-9]{10,15}$/)) {
      setError("Please enter a valid mobile number (10-15 digits).");
      return;
    }
    
    // Save active user
    localStorage.setItem("expenseTracker_activeUser", mobileNumber);
    router.push("/dashboard");
  };

  const handleLoadData = (e) => {
    e.preventDefault();
    handleContinue(e);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans flex items-center justify-center p-4 selection:bg-blue-500/30">
      <div className="max-w-md w-full space-y-8 p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
            <Wallet size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tracker</h1>
          <p className="text-zinc-400">Your personal finance dashboard.</p>
        </div>

        <form onSubmit={handleContinue} className="relative space-y-6 mt-8">
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-zinc-300 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Smartphone size={20} className="text-zinc-500" />
              </div>
              <input
                id="mobile"
                type="tel"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                  setError("");
                }}
                className="block w-full pl-12 pr-4 py-3.5 bg-zinc-950/50 border border-zinc-800/80 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 outline-none"
                placeholder="Enter your number"
                autoComplete="off"
              />
            </div>
            {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Continue
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              type="button"
              onClick={handleLoadData}
              className="w-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 font-medium py-3.5 px-4 rounded-xl border border-zinc-700/50 hover:border-zinc-700 transition-all duration-200 outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Load My Data
            </button>
          </div>
        </form>

        <p className="text-xs text-center text-zinc-500 mt-8 relative">
          Your data is stored securely in your browser's local storage. No backend required.
        </p>
      </div>
    </div>
  );
}
