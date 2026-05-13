"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function CategoryBreakdown({ expenses = [], rate = 1, formatCurrency }) {
  const categories = [
    { name: 'Food', color: '#f97316' }, // orange
    { name: 'Travel', color: '#3b82f6' }, // blue
    { name: 'Marketing', color: '#ec4899' }, // pink
    { name: 'Utilities', color: '#06b6d4' }, // cyan
    { name: 'Other', color: '#8b5cf6' }, // purple
  ];

  // Calculate totals per category
  const data = categories.map(cat => {
    const totalUSD = expenses
      .filter(exp => exp.category === cat.name)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    return { ...cat, value: totalUSD * rate };
  }).filter(cat => cat.value > 0);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 shadow-xl shadow-black/20 h-full flex flex-col">
      <h2 className="text-lg font-bold text-white mb-2">Category Breakdown</h2>
      
      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-zinc-950/30 rounded-2xl border border-dashed border-zinc-800 mt-4 min-h-[220px]">
          <svg className="w-8 h-8 text-zinc-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
          <p className="text-zinc-400 font-medium">No category data</p>
          <p className="text-xs text-zinc-500 mt-1">Add expenses to see breakdown</p>
        </div>
      ) : (
        <>
          <div className="flex-1 relative min-h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 600 }}
                  formatter={(value) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-zinc-400 font-medium">Total</span>
              <span className="text-xl font-bold text-white">{formatCurrency(total)}</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                <div className="flex-1">
                  <p className="text-xs text-zinc-400 font-medium">{item.name}</p>
                  <p className="text-sm font-semibold text-zinc-100">{Math.round((item.value / total) * 100)}%</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
