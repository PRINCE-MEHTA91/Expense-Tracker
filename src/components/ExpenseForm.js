"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const CATEGORIES = ["Food", "Travel", "Marketing", "Utilities", "Other"];

export default function ExpenseForm({ onAddExpense, currencySymbol = "$" }) {
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expenseName || !amount) return;

    if (onAddExpense) {
      onAddExpense({
        id: Date.now().toString(),
        expenseName,
        amount,
        category,
      });
    }

    setExpenseName("");
    setAmount("");
    setCategory(CATEGORIES[0]);
  };

  return (
    <div id="expense-form" className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 shadow-xl shadow-black/20 scroll-mt-24">
      <h2 className="text-lg font-bold text-white mb-5">Quick Expense Add</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5 ml-1 uppercase tracking-wider">Expense Name</label>
          <input
            type="text"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-zinc-600 text-sm"
            placeholder="e.g., Software Subscription"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 ml-1 uppercase tracking-wider">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">{currencySymbol}</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-7 pr-4 py-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-zinc-600 text-sm"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 ml-1 uppercase tracking-wider">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none text-sm cursor-pointer"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950 flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add Expense
        </button>
      </form>
    </div>
  );
}
