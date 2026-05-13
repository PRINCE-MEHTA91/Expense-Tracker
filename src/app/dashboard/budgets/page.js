"use client";

import { useState, useEffect } from "react";
import BudgetProgress from "@/components/BudgetProgress";
import { Target, Save } from "lucide-react";

export default function BudgetsPage() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [activeUser, setActiveUser] = useState("");

  const categories = ["Food", "Travel", "Marketing", "Utilities", "Other"];

  useEffect(() => {
    const user = localStorage.getItem("expenseTracker_activeUser");
    if (user) {
      setActiveUser(user);
      
      const savedExpenses = localStorage.getItem(`expenseTracker_${user}_expenses`);
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      
      const savedBudgets = localStorage.getItem(`expenseTracker_${user}_budgets`);
      if (savedBudgets) {
        setBudgets(JSON.parse(savedBudgets));
      } else {
        // Default budgets
        setBudgets({
          'Food': 1500,
          'Travel': 800,
          'Marketing': 2000,
          'Utilities': 500,
          'Other': 500
        });
      }
      
      const savedCurrency = localStorage.getItem(`expenseTracker_${user}_currency`);
      if (savedCurrency) setCurrency(savedCurrency);
    }
    setIsLoaded(true);
  }, []);

  const handleBudgetChange = (category, value) => {
    const numValue = parseFloat(value) || 0;
    const newBudgets = { ...budgets, [category]: numValue };
    setBudgets(newBudgets);
  };

  const handleSaveBudgets = () => {
    if (activeUser) {
      localStorage.setItem(`expenseTracker_${activeUser}_budgets`, JSON.stringify(budgets));
      alert("Budgets saved successfully!");
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(value);
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Budgets</h1>
          <p className="text-zinc-400 text-sm mt-1">Set limits and track your spending goals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Target size={16} className="text-blue-400" />
            </div>
            Set Category Budgets
          </h2>

          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat}>
                <label className="block text-sm font-medium text-zinc-300 mb-1">{cat}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).formatToParts(0).find(p=>p.type==='currency')?.value || '$'}</span>
                  <input
                    type="number"
                    value={budgets[cat] || ''}
                    onChange={(e) => handleBudgetChange(cat, e.target.value)}
                    className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl pl-8 pr-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleSaveBudgets}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-4 outline-none"
            >
              <Save size={18} />
              Save Budgets
            </button>
          </div>
        </div>

        <div>
          <BudgetProgress expenses={expenses} rate={1} formatCurrency={formatCurrency} budgetLimits={budgets} />
        </div>
      </div>
    </div>
  );
}
