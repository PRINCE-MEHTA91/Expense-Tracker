"use client";

export default function BudgetProgress({ expenses = [], rate = 1, formatCurrency, budgetLimits = {} }) {
  // Predefined budget limits in base USD if none provided
  const budgetLimitsUSD = Object.keys(budgetLimits).length > 0 ? budgetLimits : {
    'Food': 1500,
    'Travel': 800,
    'Marketing': 2000,
    'Utilities': 500
  };

  const budgets = Object.keys(budgetLimitsUSD).map(catName => {
    const spentUSD = expenses
      .filter(exp => exp.category === catName)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    
    let color = 'bg-zinc-500';
    if (catName === 'Food') color = 'bg-orange-500';
    if (catName === 'Travel') color = 'bg-blue-500';
    if (catName === 'Marketing') color = 'bg-purple-500';
    if (catName === 'Utilities') color = 'bg-cyan-500';

    return {
      name: catName,
      spent: spentUSD * rate,
      total: budgetLimitsUSD[catName] * rate,
      color
    };
  });

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Budget Progress</h2>
      </div>
      
      <div className="space-y-6">
        {budgets.map((budget) => {
          const percentage = Math.min(Math.round((budget.spent / budget.total) * 100), 100);
          return (
            <div key={budget.name}>
              <div className="flex justify-between text-sm mb-2.5">
                <span className="font-medium text-zinc-300">{budget.name}</span>
                <span className="text-zinc-400 font-medium">
                  <span className="text-white">{formatCurrency(budget.spent)}</span> / {formatCurrency(budget.total)}
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-800/80 rounded-full overflow-hidden border border-zinc-700/50">
                <div 
                  className={`h-full rounded-full ${budget.color} relative transition-all duration-500`} 
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
