import { forwardRef } from 'react'

const Input = forwardRef(function Input({ label, error, icon: Icon, type = 'text', className = '', containerClass = '', ...props }, ref) {
  return (
    <div className={`space-y-1.5 ${containerClass}`}>
      {label && (
        <label className="block text-[13px] font-medium text-slate-600">
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-slate-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full rounded-xl border bg-white text-slate-800 text-sm transition-all duration-200 outline-none placeholder:text-slate-400 ${Icon ? 'pl-10 pr-3.5 py-2.5' : 'px-3.5 py-2.5'} ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-50' : 'border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-50'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500 mt-0.5">{error}</p>}
    </div>
  )
})

export default Input