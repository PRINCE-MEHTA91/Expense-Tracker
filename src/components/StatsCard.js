"use client";

export default function StatsCard({ title, amount, trend, trendUp, icon: Icon, colorTheme }) {
  return (
    <div className="relative overflow-hidden bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 group hover:border-zinc-700/80 transition-all duration-300 shadow-xl shadow-black/20">
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl group-hover:opacity-100 opacity-50 transition-all duration-500 ${colorTheme.glow}`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-zinc-400 mb-1">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{amount}</h3>
        </div>
        <div className={`p-3 rounded-2xl border ${colorTheme.bg} ${colorTheme.border} ${colorTheme.text}`}>
          <Icon size={24} strokeWidth={2} />
        </div>
      </div>
      
      {trend && (
        <div className="mt-6 flex items-center gap-2 relative z-10">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${trendUp ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : 'text-rose-400 bg-rose-400/10 border border-rose-400/20'}`}>
            {trendUp ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
            )}
            {trend}
          </span>
          <span className="text-xs text-zinc-500 font-medium">vs last month</span>
        </div>
      )}
    </div>
  );
}
