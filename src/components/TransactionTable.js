"use client";
import { Trash2 } from "lucide-react";

export default function TransactionTable({ expenses = [], onDelete, rate = 1, formatCurrency }) {
  // Category colors mapping
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Food': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Travel': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Marketing': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'Utilities': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 shadow-xl shadow-black/20 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
      </div>
      
      {expenses.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/30">
          <div className="bg-zinc-800/50 p-4 rounded-full mb-4">
            <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-zinc-300 font-medium">No transactions available</p>
          <p className="text-sm text-zinc-500 mt-1">Add an expense to populate this table.</p>
        </div>
      ) : (
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 rounded-xl">
              <tr>
                <th className="px-4 py-3.5 rounded-l-xl font-semibold tracking-wider">Date</th>
                <th className="px-4 py-3.5 font-semibold tracking-wider">Description</th>
                <th className="px-4 py-3.5 font-semibold tracking-wider">Category</th>
                <th className="px-4 py-3.5 font-semibold tracking-wider text-right">Amount</th>
                <th className="px-4 py-3.5 rounded-r-xl"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {expenses.map((expense) => {
                const date = new Date(parseInt(expense.id));
                const formattedDate = isNaN(date) ? "Today" : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                return (
                  <tr key={expense.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-4 py-4 text-zinc-400 whitespace-nowrap">{formattedDate}</td>
                    <td className="px-4 py-4 font-medium text-zinc-200">{expense.expenseName}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-rose-400 text-right">
                      -{formatCurrency(parseFloat(expense.amount) * rate)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => onDelete(expense.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-400/10 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100"
                        aria-label="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
