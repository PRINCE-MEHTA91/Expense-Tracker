"use client";

import { useState, useEffect } from "react";
import IncomeForm from "@/components/IncomeForm";
import TransactionTable from "@/components/TransactionTable";
import { ArrowUpRight } from "lucide-react";
import StatsCard from "@/components/StatsCard";

export default function IncomePage() {
  const [income, setIncome] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [activeUser, setActiveUser] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("expenseTracker_activeUser");
    if (user) {
      setActiveUser(user);
      const savedIncome = localStorage.getItem(`expenseTracker_${user}_income`);
      if (savedIncome) setIncome(JSON.parse(savedIncome));
      
      const savedCurrency = localStorage.getItem(`expenseTracker_${user}_currency`);
      if (savedCurrency) setCurrency(savedCurrency);
    }
    setIsLoaded(true);
  }, []);

  const handleAddIncome = (inc) => {
    const newIncome = [inc, ...income];
    setIncome(newIncome);
    if (activeUser) {
      localStorage.setItem(`expenseTracker_${activeUser}_income`, JSON.stringify(newIncome));
    }
  };

  const handleDeleteIncome = (id) => {
    const newIncome = income.filter((inc) => inc.id !== id);
    setIncome(newIncome);
    if (activeUser) {
      localStorage.setItem(`expenseTracker_${activeUser}_income`, JSON.stringify(newIncome));
    }
  };

  const getCurrencySymbol = () => {
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency });
    const parts = formatter.formatToParts(0);
    return parts.find(part => part.type === 'currency')?.value || '$';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(value);
  };

  const totalIncomeDisplay = income.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);

  if (!isLoaded) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Income</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage and track your income streams.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard 
          title="Total Income" 
          amount={formatCurrency(totalIncomeDisplay)} 
          icon={ArrowUpRight}
          colorTheme={{ bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", glow: "bg-emerald-500/10" }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className="xl:col-span-2 space-y-6">
          <TransactionTable expenses={income} onDelete={handleDeleteIncome} rate={1} formatCurrency={formatCurrency} />
        </div>
        <div className="xl:col-span-1 space-y-6">
          <IncomeForm onAddIncome={handleAddIncome} currencySymbol={getCurrencySymbol()} />
        </div>
      </div>
    </div>
  );
}
