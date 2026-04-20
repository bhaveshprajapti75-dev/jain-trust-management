const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Verified: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Passed: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Inactive: 'bg-slate-100 text-slate-600 border-slate-200/60',
  Suspended: 'bg-amber-50 text-amber-700 border-amber-200/60',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200/60',
  Unread: 'bg-teal-50 text-teal-700 border-teal-200/60',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200/60',
  Failed: 'bg-rose-50 text-rose-700 border-rose-200/60',
  Read: 'bg-slate-50 text-slate-500 border-slate-200/60',
  Processing: 'bg-sky-50 text-sky-700 border-sky-200/60',
}

const dotColors = {
  Active: 'bg-emerald-500', Approved: 'bg-emerald-500', Verified: 'bg-emerald-500', Paid: 'bg-emerald-500', Passed: 'bg-emerald-500',
  Inactive: 'bg-slate-400', Suspended: 'bg-amber-500', Pending: 'bg-amber-500', Unread: 'bg-teal-500',
  Rejected: 'bg-rose-500', Failed: 'bg-rose-500', Read: 'bg-slate-300', Processing: 'bg-sky-500',
}

export default function StatusBadge({ status, size = 'sm' }) {
  const style = statusStyles[status] || 'bg-slate-100 text-slate-600 border-slate-200/60'
  const dot = dotColors[status] || 'bg-slate-400'
  const sizeClass = size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1'
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />{status}
    </span>
  )
}
