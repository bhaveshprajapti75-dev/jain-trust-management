export default function UserStatusToggle({ status, onChange }) {
  const active = status === 'Active'
  return (
    <button
      type="button"
      onClick={function() { onChange(active ? 'Inactive' : 'Active') }}
      className={`inline-flex items-center gap-3 rounded-full border px-2 py-1.5 transition-all ${
        active
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-slate-200 bg-slate-100'
      }`}
    >
      <span
        className={`relative flex h-7 w-12 items-center rounded-full transition-all ${
          active ? 'bg-emerald-500' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
            active ? 'left-6' : 'left-1'
          }`}
        />
      </span>
      <span className={`min-w-[52px] text-left text-[12px] font-semibold ${active ? 'text-emerald-700' : 'text-slate-600'}`}>
        {active ? 'Active' : 'Inactive'}
      </span>
    </button>
  )
}
