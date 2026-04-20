import { Eye, Pencil, Trash2 } from 'lucide-react'

const variantStyles = {
  view: 'hover:bg-teal-50 hover:text-teal-600',
  edit: 'hover:bg-sky-50 hover:text-sky-600',
  delete: 'hover:bg-rose-50 hover:text-rose-600',
  default: 'hover:bg-slate-100 hover:text-slate-700',
}

export default function CommonActionButtons({ actions = [], className = '' }) {
  if (!actions.length) return null

  return (
    <div className={`flex items-center gap-0.5 ${className}`} onClick={(event) => event.stopPropagation()}>
      {actions
        .filter((action) => !action?.hidden)
        .map((action, index) => {
          const Icon = action.icon || (action.variant === 'view' ? Eye : action.variant === 'edit' ? Pencil : action.variant === 'delete' ? Trash2 : Eye)
          const style = variantStyles[action.variant] || variantStyles.default

          return (
            <button
              key={action.key || action.label || index}
              type="button"
              onClick={action.onClick}
              title={action.label}
              className={`w-7 h-7 rounded-md bg-slate-50 text-slate-400 flex items-center justify-center transition-all ${style}`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          )
        })}
    </div>
  )
}
