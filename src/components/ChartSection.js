"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ChartSection({ expenses = [], rate = 1, formatCurrency }) {
  // Generate last 7 days data dynamically
  const data = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayStart = new Date(d.setHours(0,0,0,0)).getTime();
    const dayEnd = new Date(d.setHours(23,59,59,999)).getTime();
    
    const dayExpensesUSD = expenses
      .filter(exp => {
        const expTime = parseInt(exp.id);
        return expTime >= dayStart && expTime <= dayEnd;
      })
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      
    return {
      name: dayName,
      expenses: dayExpensesUSD * rate,
      // Fixed daily income for visual purposes, converted to current currency
      income: (10000 / 30) * rate
    };
  });

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 shadow-xl shadow-black/20 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Cash Flow (Last 7 Days)</h2>
        <select className="bg-zinc-800/50 border border-zinc-700 text-zinc-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-zinc-800 transition-colors">
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>
      
      <div className="flex-1 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 500 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 500 }} tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ color: '#fff', fontWeight: 600 }}
              labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
              formatter={(value) => formatCurrency(value)}
            />
            <Area type="monotone" dataKey="income" name="Income" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
