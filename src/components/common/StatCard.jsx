import { TrendingUp, TrendingDown } from 'lucide-react'

const colorMap = {
  teal: {
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  sage: {
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  emerald: {
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  rose: {
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
  sky: {
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
  amber: {
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
}

export default function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'teal', compact = false, className = '' }) {
  const c = colorMap[color] || colorMap.teal
  const isPositive = trend === 'up'
  const containerPadding = compact ? 'p-3.5' : 'p-4'
  const valueTextSize = compact ? 'text-2xl' : 'text-[28px]'
  const valueWeight = compact ? 'font-semibold' : 'font-bold'
  const iconWrap = compact ? 'w-10 h-10 rounded-md' : 'w-11 h-11 rounded-lg'
  const iconSize = compact ? 'w-5 h-5' : 'w-5 h-5'

  return (
    <div className={`bg-white rounded-lg ${containerPadding} flex items-center justify-between gap-4 shadow-sm ${className}`}>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] text-zinc-900 font-medium truncate">{title}</p>
        <div className="mt-1.5 flex items-center gap-2.5">
          <p className={`${valueTextSize} ${valueWeight} text-slate-900 leading-none`}>{value}</p>
          {trendValue !== undefined && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {trendValue}
            </span>
          )}
        </div>
      </div>

      {Icon && (
        <div className={`${c.iconBg} ${iconWrap} flex items-center justify-center shrink-0`}>
          <Icon className={`${iconSize} ${c.iconColor}`} strokeWidth={2.1} />
        </div>
      )}
    </div>
  )
}