"use client";

export default function ExpenseCard({ expense, onDelete }) {
  return (
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{expense.expenseName}</span>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-0.5">{expense.category}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg text-zinc-900 dark:text-white">
          ${parseFloat(expense.amount).toFixed(2)}
        </span>
        <button
          onClick={() => onDelete(expense.id)}
          className="text-zinc-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Delete expense"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
