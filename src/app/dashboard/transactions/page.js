"use client";

import { useState, useEffect } from "react";
import { CreditCard, ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const user = localStorage.getItem("expenseTracker_activeUser");
    if (user) {
      const savedExpenses = localStorage.getItem(`expenseTracker_${user}_expenses`);
      const savedIncome = localStorage.getItem(`expenseTracker_${user}_income`);
      
      let allTrans = [];
      if (savedExpenses) {
        allTrans = [...allTrans, ...JSON.parse(savedExpenses).map(t => ({...t, type: 'expense'}))];
      }
      if (savedIncome) {
        allTrans = [...allTrans, ...JSON.parse(savedIncome).map(t => ({...t, type: 'income'}))];
      }

      // Sort by date descending
      allTrans.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });

      setTransactions(allTrans);
      
      const savedCurrency = localStorage.getItem(`expenseTracker_${user}_currency`);
      if (savedCurrency) setCurrency(savedCurrency);
    }
    setIsLoaded(true);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(value);
  };

  const handleDelete = (id, type) => {
    const user = localStorage.getItem("expenseTracker_activeUser");
    if (!user) return;

    if (type === 'expense') {
      const savedExpenses = JSON.parse(localStorage.getItem(`expenseTracker_${user}_expenses`) || '[]');
      const newExpenses = savedExpenses.filter(e => e.id !== id);
      localStorage.setItem(`expenseTracker_${user}_expenses`, JSON.stringify(newExpenses));
    } else {
      const savedIncome = JSON.parse(localStorage.getItem(`expenseTracker_${user}_income`) || '[]');
      const newIncome = savedIncome.filter(i => i.id !== id);
      localStorage.setItem(`expenseTracker_${user}_income`, JSON.stringify(newIncome));
    }

    setTransactions(transactions.filter(t => t.id !== id));
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-zinc-400 text-sm mt-1">All your incoming and outgoing transactions.</p>
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <CreditCard size={16} className="text-indigo-400" />
          </div>
          Transaction History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/80 text-zinc-400 text-sm">
                <th className="pb-3 font-medium px-4">Date</th>
                <th className="pb-3 font-medium px-4">Description</th>
                <th className="pb-3 font-medium px-4">Category</th>
                <th className="pb-3 font-medium px-4 text-right">Amount</th>
                <th className="pb-3 font-medium px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-zinc-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                    <td className="py-4 px-4 text-zinc-300">
                      {tx.date || new Date(parseInt(tx.id)).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-zinc-200 font-medium">
                      {tx.expenseName || tx.incomeName || 'Unnamed'}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800/50 text-zinc-300 border border-zinc-700/50">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      {tx.type === 'income' ? (
                        <div className="flex items-center justify-end gap-1 text-emerald-400">
                          <ArrowUpRight size={14} />
                          {formatCurrency(tx.amount)}
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1 text-rose-400">
                          <ArrowDownRight size={14} />
                          {formatCurrency(tx.amount)}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => handleDelete(tx.id, tx.type)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-rose-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
