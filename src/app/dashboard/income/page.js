"use client";

import { useState, useEffect } from "react";
import IncomeForm from "@/components/IncomeForm";
import TransactionTable from "@/components/TransactionTable";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingDown, TrendingUp } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { useCurrency } from "@/context/CurrencyContext";

export default function IncomePage() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeUser, setActiveUser] = useState("");
  const { currency, rate, formatCurrency, toUSD } = useCurrency();

  useEffect(() => {
    const user = localStorage.getItem("expenseTracker_activeUser");
    if (user) {
      setActiveUser(user);
      const savedIncome = localStorage.getItem(`expenseTracker_${user}_income`);
      if (savedIncome) setIncome(JSON.parse(savedIncome));

      const savedExpenses = localStorage.getItem(`expenseTracker_${user}_expenses`);
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    }
    setIsLoaded(true);
  }, []);

  const handleAddIncome = (inc) => {
    // Normalize entered amount to USD base so switching currency converts correctly
    const normalizedInc = { ...inc, amount: toUSD(inc.amount) };
    const newIncome = [normalizedInc, ...income];
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

  // Core calculations (in base USD, then apply rate for display)
  const totalIncomeUSD = income.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0);
  const totalSpentUSD  = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const remainingUSD   = totalIncomeUSD - totalSpentUSD;

  const totalIncomeDisplay   = totalIncomeUSD  * rate;
  const totalSpentDisplay    = totalSpentUSD   * rate;
  const remainingDisplay     = remainingUSD    * rate;

  // Usage percentage (cap at 100 for bar, allow overspend indicator)
  const usagePercent = totalIncomeUSD > 0
    ? Math.min((totalSpentUSD / totalIncomeUSD) * 100, 100)
    : 0;
  const isOverspent = totalSpentUSD > totalIncomeUSD;
  const savingsRate = totalIncomeUSD > 0
    ? Math.max(((totalIncomeUSD - totalSpentUSD) / totalIncomeUSD) * 100, 0)
    : 0;

  if (!isLoaded) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Income</h1>
          <p className="text-zinc-400 text-sm mt-1">Track your earnings and how you spend them.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatsCard
          title="Total Income"
          amount={formatCurrency(totalIncomeDisplay)}
          icon={ArrowUpRight}
          colorTheme={{ bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", glow: "bg-emerald-500/10" }}
        />
        <StatsCard
          title="Total Spent"
          amount={formatCurrency(totalSpentDisplay)}
          icon={ArrowDownRight}
          colorTheme={{ bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", glow: "bg-rose-500/10" }}
        />
        <StatsCard
          title="Remaining Balance"
          amount={formatCurrency(Math.abs(remainingDisplay))}
          icon={isOverspent ? TrendingDown : Wallet}
          colorTheme={isOverspent
            ? { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", glow: "bg-amber-500/10" }
            : { bg: "bg-blue-500/10",  text: "text-blue-400",  border: "border-blue-500/20",  glow: "bg-blue-500/10"  }
          }
        />
      </div>

      {/* Spending Overview Panel */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <TrendingUp size={16} className="text-blue-400" />
            </div>
            Spending Overview
          </h2>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${
              isOverspent
                ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
            }`}>
              {isOverspent ? '⚠ Overspent!' : `${savingsRate.toFixed(1)}% saved`}
            </span>
          </div>
        </div>

        {totalIncomeUSD === 0 ? (
          <div className="text-center py-8 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/30">
            <p className="text-zinc-400 font-medium">No income added yet</p>
            <p className="text-sm text-zinc-500 mt-1">Add income to see your spending breakdown.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm text-zinc-400 mb-2">
                <span>Used: <span className="text-rose-400 font-semibold">{formatCurrency(totalSpentDisplay)}</span></span>
                <span>Total: <span className="text-emerald-400 font-semibold">{formatCurrency(totalIncomeDisplay)}</span></span>
              </div>
              <div className="h-4 w-full bg-zinc-800/80 rounded-full overflow-hidden border border-zinc-700/50 relative">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out relative ${
                    isOverspent
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : usagePercent > 70
                      ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full" />
                </div>
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mt-1.5">
                <span>{usagePercent.toFixed(1)}% used</span>
                <span className={isOverspent ? 'text-amber-400' : 'text-zinc-400'}>
                  {isOverspent
                    ? `Over budget by ${formatCurrency(Math.abs(remainingDisplay))}`
                    : `${formatCurrency(remainingDisplay)} remaining`}
                </span>
              </div>
            </div>

            {/* Mini breakdown by category */}
            {expenses.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Spent by Category</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {['Food', 'Travel', 'Marketing', 'Utilities', 'Other'].map(cat => {
                    const catSpentUSD = expenses
                      .filter(e => e.category === cat)
                      .reduce((s, e) => s + parseFloat(e.amount || 0), 0);
                    if (catSpentUSD === 0) return null;
                    const catPct = totalIncomeUSD > 0 ? ((catSpentUSD / totalIncomeUSD) * 100).toFixed(1) : 0;
                    const colors = {
                      Food: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
                      Travel: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
                      Marketing: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
                      Utilities: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
                      Other: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
                    };
                    return (
                      <div key={cat} className={`rounded-2xl border p-3 ${colors[cat]}`}>
                        <p className="text-[11px] font-semibold uppercase tracking-wider opacity-70">{cat}</p>
                        <p className="text-sm font-bold mt-1">{formatCurrency(catSpentUSD * rate)}</p>
                        <p className="text-[11px] opacity-60 mt-0.5">{catPct}% of income</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table + Form */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className="xl:col-span-2 space-y-6">
          <TransactionTable
            expenses={income}
            onDelete={handleDeleteIncome}
            rate={rate}
            formatCurrency={formatCurrency}
          />
        </div>
        <div className="xl:col-span-1 space-y-6">
          <IncomeForm onAddIncome={handleAddIncome} currencySymbol={getCurrencySymbol()} />
        </div>
      </div>
    </div>
  );
}
