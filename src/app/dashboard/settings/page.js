"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Trash2, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [activeUser, setActiveUser] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("expenseTracker_activeUser");
    if (user) {
      setActiveUser(user);
    }
    setIsLoaded(true);
  }, []);

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all your data? This action cannot be undone.")) {
      localStorage.removeItem(`expenseTracker_${activeUser}_expenses`);
      localStorage.removeItem(`expenseTracker_${activeUser}_income`);
      localStorage.removeItem(`expenseTracker_${activeUser}_budgets`);
      localStorage.removeItem(`expenseTracker_${activeUser}_currency`);
      alert("Data cleared successfully.");
      window.location.reload();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("expenseTracker_activeUser");
    router.push("/");
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your account and preferences.</p>
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 shadow-xl max-w-2xl">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center border border-zinc-700/50">
            <SettingsIcon size={16} className="text-zinc-400" />
          </div>
          Account Preferences
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b border-zinc-800/40">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Smartphone size={20} />
              </div>
              <div>
                <p className="text-white font-medium">Mobile Number</p>
                <p className="text-sm text-zinc-400">Logged in as {activeUser}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-medium text-zinc-300 mb-4">Danger Zone</h3>
            <button
              onClick={handleClearData}
              className="w-full sm:w-auto bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/30 font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Clear All My Data
            </button>
            <p className="text-xs text-zinc-500 mt-3">
              This will permanently delete your expenses, income, and budget data from this browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
