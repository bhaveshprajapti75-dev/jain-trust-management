import { Loader2 } from 'lucide-react'

export default function Loader({ className = 'py-12', size = 'md', text }) {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-7 h-7', lg: 'w-10 h-10' }
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeMap[size]} text-teal-500 animate-spin`} />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  )
}