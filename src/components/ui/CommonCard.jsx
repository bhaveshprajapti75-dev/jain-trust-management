import StatusBadge from './StatusBadge'
import CommonActionButtons from './CommonActionButtons'

export default function CommonCard({
  icon: Icon,
  iconContent,
  iconWrapperClassName = '',
  iconClassName = '',
  accentClassName = 'bg-emerald-600',
  title,
  subtitle,
  status,
  description,
  meta = [],
  tags,
  footerLeft,
  actions = [],
  className = '',
  onClick,
  index = 0,
  children,
}) {
  return (
    <div
      onClick={onClick}
      className={`group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all overflow-hidden relative ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ animation: `cardIn 0.3s ease-out ${index * 0.04}s both` }}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-all ${accentClassName}`} />

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${iconWrapperClassName}`}>
              {iconContent || (Icon ? <Icon className={`w-5 h-5 ${iconClassName}`} strokeWidth={2} /> : null)}
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-bold text-slate-800 group-hover:text-emerald-700 truncate">{title}</h3>
              {subtitle ? <p className="text-[11px] text-slate-400 font-medium truncate">{subtitle}</p> : null}
            </div>
          </div>
          {status ? <StatusBadge status={status} /> : null}
        </div>

        {tags ? <div className="flex flex-wrap items-center gap-2">{tags}</div> : null}

        {description ? <p className="text-[11px] text-slate-500 leading-relaxed">{description}</p> : null}

        {meta.length ? (
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            {meta.map((item, itemIndex) => (
              <span key={item.key || item.label || item.value || itemIndex} className={item.className || ''}>
                {item.label ? `${item.label}: ${item.value}` : item.value}
              </span>
            ))}
          </div>
        ) : null}

        {children}
      </div>

      {(footerLeft || actions.length > 0) ? (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-50 bg-slate-50/30">
          <div>{footerLeft}</div>
          <CommonActionButtons actions={actions} />
        </div>
      ) : null}
    </div>
  )
}
