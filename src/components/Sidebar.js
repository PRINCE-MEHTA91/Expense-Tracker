"use client";
import { LayoutDashboard, CreditCard, Wallet, PieChart, BarChart3, Target, Settings, LogOut, X } from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Transactions", icon: CreditCard },
    { name: "Accounts", icon: Wallet },
    { name: "Budgets", icon: PieChart },
    { name: "Reports", icon: BarChart3 },
    { name: "Goals", icon: Target },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-zinc-950/95 backdrop-blur-xl border-r border-zinc-800/60 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Tracker</span>
          </div>
          <button 
            className="lg:hidden text-zinc-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                setSidebarOpen(false); // auto-close on mobile
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.name 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <item.icon size={20} className={activeTab === item.name ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300 transition-colors'} />
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/60 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-all duration-200 group border border-transparent">
            <Settings size={20} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            <span className="font-medium text-sm">Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 group border border-transparent hover:border-rose-500/20">
            <LogOut size={20} className="text-rose-500/70 group-hover:text-rose-400 transition-colors" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
