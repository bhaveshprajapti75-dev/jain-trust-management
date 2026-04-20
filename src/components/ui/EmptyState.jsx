import { Inbox } from 'lucide-react'

export default function EmptyState({ message = 'No data found', description, icon, action }) {
  const ResolvedIcon = icon || Inbox

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
        <ResolvedIcon className="w-7 h-7 text-slate-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-semibold text-slate-600 mb-1">{message}</h3>
      {description && <p className="text-sm text-slate-400 text-center max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
