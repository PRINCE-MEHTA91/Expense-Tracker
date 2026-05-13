"use client";

import { useState, useEffect } from "react";
import StatsCard from "@/components/StatsCard";
import ChartSection from "@/components/ChartSection";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import TransactionTable from "@/components/TransactionTable";
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export default function DashboardOverview() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [rate, setRate] = useState(1);

  useEffect(() => {
    const activeUser = localStorage.getItem("expenseTracker_activeUser");
    if (activeUser) {
      const savedExpenses = localStorage.getItem(`expenseTracker_${activeUser}_expenses`);
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      
      const savedIncome = localStorage.getItem(`expenseTracker_${activeUser}_income`);
      if (savedIncome) setIncome(JSON.parse(savedIncome));

      const savedCurrency = localStorage.getItem(`expenseTracker_${activeUser}_currency`);
      if (savedCurrency) setCurrency(savedCurrency);
    }
    setIsLoaded(true);
  }, []);

  const totalExpensesUSD = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const totalIncomeUSD = income.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
  
  const totalExpensesDisplay = totalExpensesUSD * rate;
  const totalIncomeDisplay = totalIncomeUSD * rate;
  const totalBalanceDisplay = (totalIncomeUSD - totalExpensesUSD) * rate;
  
  const savingsRate = totalIncomeUSD > 0 ? ((totalIncomeUSD - totalExpensesUSD) / totalIncomeUSD) * 100 : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(value);
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-400 text-sm mt-1">Here's your financial summary.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard 
          title="Total Balance" 
          amount={formatCurrency(totalBalanceDisplay)} 
          icon={DollarSign}
          colorTheme={{ bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", glow: "bg-blue-500/10" }}
        />
        <StatsCard 
          title="Total Income" 
          amount={formatCurrency(totalIncomeDisplay)} 
          icon={ArrowUpRight}
          colorTheme={{ bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", glow: "bg-emerald-500/10" }}
        />
        <StatsCard 
          title="Total Expenses" 
          amount={formatCurrency(totalExpensesDisplay)} 
          icon={ArrowDownRight}
          colorTheme={{ bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", glow: "bg-rose-500/10" }}
        />
        <StatsCard 
          title="Savings Rate" 
          amount={`${savingsRate.toFixed(1)}%`} 
          icon={Activity}
          colorTheme={{ bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", glow: "bg-purple-500/10" }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className="xl:col-span-2">
          <ChartSection expenses={expenses} rate={rate} formatCurrency={formatCurrency} />
        </div>
        <div className="xl:col-span-1">
          <CategoryBreakdown expenses={expenses} rate={rate} formatCurrency={formatCurrency} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-6">
        <TransactionTable expenses={expenses} onDelete={(id) => {
          // This should realistically update localStorage too.
          // But maybe only allow deleting on Expenses page or implement here.
          const activeUser = localStorage.getItem("expenseTracker_activeUser");
          const newExpenses = expenses.filter(e => e.id !== id);
          setExpenses(newExpenses);
          localStorage.setItem(`expenseTracker_${activeUser}_expenses`, JSON.stringify(newExpenses));
        }} rate={rate} formatCurrency={formatCurrency} />
      </div>
    </div>
  );
}
