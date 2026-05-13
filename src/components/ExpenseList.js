"use client";

import ExpenseCard from "./ExpenseCard";

export default function ExpenseList({ expenses, onDelete }) {
  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full border border-zinc-200/50 dark:border-zinc-800/50 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          Recent Expenses
        </h2>
        <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 py-1 px-3 rounded-full text-sm font-semibold">
          {expenses.length} Total
        </span>
      </div>
      
      {expenses.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl min-h-[250px]">
          <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-full mb-4">
            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4M12 20V4" />
            </svg>
          </div>
          <p className="text-zinc-600 dark:text-zinc-300 font-medium text-lg">No expenses added yet</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">Add an expense using the form to see it here.</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
          {expenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
