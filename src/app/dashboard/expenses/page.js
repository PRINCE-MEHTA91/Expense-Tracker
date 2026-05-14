"use client";

import { useState, useEffect } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import TransactionTable from "@/components/TransactionTable";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import { Plus } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeUser, setActiveUser] = useState("");
  const { currency, rate, formatCurrency, toUSD } = useCurrency();

  useEffect(() => {
    const user = localStorage.getItem("expenseTracker_activeUser");
    if (user) {
      setActiveUser(user);
      const savedExpenses = localStorage.getItem(`expenseTracker_${user}_expenses`);
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    }
    setIsLoaded(true);
  }, []);

  const handleAddExpense = (expense) => {
    // Normalize entered amount to USD base so switching currency converts correctly
    const normalizedExpense = { ...expense, amount: toUSD(expense.amount) };
    const newExpenses = [normalizedExpense, ...expenses];
    setExpenses(newExpenses);
    if (activeUser) {
      localStorage.setItem(`expenseTracker_${activeUser}_expenses`, JSON.stringify(newExpenses));
    }
  };

  const handleDeleteExpense = (id) => {
    const newExpenses = expenses.filter((exp) => exp.id !== id);
    setExpenses(newExpenses);
    if (activeUser) {
      localStorage.setItem(`expenseTracker_${activeUser}_expenses`, JSON.stringify(newExpenses));
    }
  };

  const getCurrencySymbol = () => {
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency });
    const parts = formatter.formatToParts(0);
    return parts.find(part => part.type === 'currency')?.value || '$';
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Expenses</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage and track your expenses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className="xl:col-span-2 space-y-6">
          <TransactionTable expenses={expenses} onDelete={handleDeleteExpense} rate={rate} formatCurrency={formatCurrency} />
        </div>
        <div className="xl:col-span-1 space-y-6">
          <ExpenseForm onAddExpense={handleAddExpense} currencySymbol={getCurrencySymbol()} />
          <CategoryBreakdown expenses={expenses} rate={rate} formatCurrency={formatCurrency} />
        </div>
      </div>
    </div>
  );
}
