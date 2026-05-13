"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import ChartSection from "@/components/ChartSection";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import BudgetProgress from "@/components/BudgetProgress";
import TransactionTable from "@/components/TransactionTable";
import ExpenseForm from "@/components/ExpenseForm";
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity, Plus } from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState({ USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5 });
  const [ratesLoading, setRatesLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when expenses or currency change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
      localStorage.setItem("currency", currency);
    }
  }, [expenses, currency, isLoaded]);

  // Fetch currency rates from Frankfurter API
  useEffect(() => {
    async function fetchRates() {
      try {
        setRatesLoading(true);
        const res = await fetch("https://api.frankfurter.app/latest?from=USD");
        if (res.ok) {
          const data = await res.json();
          setRates({ USD: 1, ...data.rates });
        }
      } catch (error) {
        console.error("Failed to fetch rates", error);
      } finally {
        setRatesLoading(false);
      }
    }
    fetchRates();
  }, []);

  const rate = rates[currency] || 1;

  const handleAddExpense = (expense) => {
    // Store internally as USD equivalent
    const amountInUSD = parseFloat(expense.amount) / rate;
    setExpenses([{ ...expense, amount: amountInUSD }, ...expenses]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  // Filtered expenses based on search
  const filteredExpenses = expenses.filter(exp => 
    exp.expenseName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    exp.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totalExpensesUSD = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const totalExpensesDisplay = totalExpensesUSD * rate;
  
  // Assume a fixed base income of $10,000 USD for the demo
  const baseIncomeUSD = 10000;
  const totalIncomeDisplay = baseIncomeUSD * rate;
  const totalBalanceDisplay = (baseIncomeUSD - totalExpensesUSD) * rate;
  const savingsRate = baseIncomeUSD > 0 ? ((baseIncomeUSD - totalExpensesUSD) / baseIncomeUSD) * 100 : 0;

  // Format currency helper
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(value);
  };

  const getCurrencySymbol = () => {
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency });
    const parts = formatter.formatToParts(0);
    return parts.find(part => part.type === 'currency')?.value || '$';
  };

  if (!isLoaded) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-blue-500/30">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
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
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{activeTab} Overview</h1>
                <p className="text-zinc-400 text-sm mt-1">Track and manage your expenses effortlessly.</p>
              </div>
              <button 
                onClick={() => {
                  const form = document.getElementById('expense-form');
                  if (form) {
                    form.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => form.querySelector('input')?.focus(), 500);
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2.5 px-5 rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950 flex items-center gap-2 text-sm w-fit"
              >
                <Plus size={18} strokeWidth={2.5} />
                Add Expense
              </button>
            </div>

            {/* Stats Cards */}
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

            {/* Middle Section - Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
              <div className="xl:col-span-2">
                <ChartSection expenses={filteredExpenses} rate={rate} formatCurrency={formatCurrency} />
              </div>
              <div className="xl:col-span-1">
                <CategoryBreakdown expenses={filteredExpenses} rate={rate} formatCurrency={formatCurrency} />
              </div>
            </div>

            {/* Bottom Section - Tables & Forms */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
              <div className="xl:col-span-2">
                <TransactionTable expenses={filteredExpenses} onDelete={handleDeleteExpense} rate={rate} formatCurrency={formatCurrency} />
              </div>
              <div className="xl:col-span-1 space-y-4 lg:space-y-6">
                <ExpenseForm onAddExpense={handleAddExpense} currencySymbol={getCurrencySymbol()} />
                <BudgetProgress expenses={filteredExpenses} rate={rate} formatCurrency={formatCurrency} />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
