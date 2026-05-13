"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function IncomeForm({ onAddIncome, currencySymbol }) {
  const [amount, setAmount] = useState("");
  const [incomeName, setIncomeName] = useState("");
  const [category, setCategory] = useState("Salary");
  const [date, setDate] = useState("");

  const categories = ["Salary", "Freelance", "Business", "Investments", "Other"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !incomeName || !date) return;

    onAddIncome({
      id: Date.now().toString(),
      amount: parseFloat(amount),
      incomeName,
      category,
      date,
    });

    setAmount("");
    setIncomeName("");
    setCategory("Salary");
    setDate("");
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      
      <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <Plus size={16} className="text-emerald-400" />
        </div>
        Add Income
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Source</label>
          <input
            type="text"
            value={incomeName}
            onChange={(e) => setIncomeName(e.target.value)}
            className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200"
            placeholder="e.g. Monthly Salary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">{currencySymbol}</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl pl-8 pr-4 py-2.5 text-white placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200"
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 [color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200 appearance-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-emerald-500/20 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-2 outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          <Plus size={18} />
          Add Income
        </button>
      </form>
    </div>
  );
}
