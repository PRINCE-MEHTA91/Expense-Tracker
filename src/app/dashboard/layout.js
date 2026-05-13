"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // For Navbar search and currency
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [ratesLoading, setRatesLoading] = useState(false);

  useEffect(() => {
    const activeUser = localStorage.getItem("expenseTracker_activeUser");
    if (!activeUser) {
      router.push("/");
    } else {
      const savedCurrency = localStorage.getItem(`expenseTracker_${activeUser}_currency`);
      if (savedCurrency) {
        setCurrency(savedCurrency);
      }
      setIsLoaded(true);
    }
  }, [router]);

  useEffect(() => {
    if (isLoaded) {
      const activeUser = localStorage.getItem("expenseTracker_activeUser");
      if (activeUser) {
        localStorage.setItem(`expenseTracker_${activeUser}_currency`, currency);
      }
    }
  }, [currency, isLoaded]);

  if (!isLoaded) return null; // Wait until hydration and user check is done

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-blue-500/30">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <Navbar 
          setSidebarOpen={setSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currency={currency}
          setCurrency={setCurrency}
          ratesLoading={ratesLoading}
        />
        
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
