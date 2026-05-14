"use client";
import { Search, Bell, Menu } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export default function Navbar({ setSidebarOpen, searchQuery, setSearchQuery }) {
  const { currency, setCurrency, ratesLoading } = useCurrency();
  return (
    <header className="h-20 flex items-center justify-between px-4 lg:px-8 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button 
          className="lg:hidden text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        
        <div className="relative max-w-md w-full hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={18} className="text-zinc-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm"
            placeholder="Search transactions, accounts, or budgets..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-5">
        
        {/* Currency Selector */}
        <div className="relative flex items-center bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-1.5 hover:border-zinc-700 transition-colors">
          {ratesLoading ? (
             <span className="text-xs font-medium text-zinc-500 px-2 py-0.5 animate-pulse">Updating rates...</span>
          ) : (
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-sm font-semibold text-zinc-300 focus:outline-none appearance-none pr-5 cursor-pointer py-0.5"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          )}
          {!ratesLoading && (
            <div className="absolute right-2 pointer-events-none text-zinc-500">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          )}
        </div>

        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800/50">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-zinc-950" />
        </button>
        
        <div className="flex items-center gap-3 border-l border-zinc-800 pl-4 lg:pl-5">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-zinc-100">User</span>
            <span className="text-xs text-zinc-500">
              {typeof window !== "undefined" ? localStorage.getItem("expenseTracker_activeUser") || "Guest" : "Guest"}
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-zinc-800 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 cursor-pointer hover:scale-105 transition-transform">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
