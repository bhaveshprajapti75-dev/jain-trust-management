import { ChevronRight } from 'lucide-react'

export default function PageHeader({ title, subtitle, breadcrumbs = [], action, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-[11px] text-slate-400 mb-1.5">
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                {i === breadcrumbs.length - 1
                  ? <span className="text-emerald-700 font-medium">{bc.label}</span>
                  : <span className="hover:text-slate-600 transition-colors cursor-pointer">{bc.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl font-bold text-emerald-700 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  )
}