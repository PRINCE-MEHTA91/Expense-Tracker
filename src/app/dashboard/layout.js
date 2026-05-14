"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { CurrencyProvider } from "@/context/CurrencyContext";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // For Navbar search
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const activeUser = localStorage.getItem("expenseTracker_activeUser");
    if (!activeUser) {
      router.push("/");
    } else {
      setIsLoaded(true);
    }
  }, [router]);

  if (!isLoaded) return null; // Wait until hydration and user check is done

  return (
    <CurrencyProvider>
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
          />
          
          <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </CurrencyProvider>
  );
}
