import React from 'react';
import { Check, Minus } from 'lucide-react';

export default function PermissionChip({ label, granted, size = 'sm' }) {
  const sizeClass = size === 'xs' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5';
  
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-md ${sizeClass} ${granted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400 line-through'}`}>
      {granted ? <Check className="w-2.5 h-2.5" strokeWidth={3} /> : <Minus className="w-2.5 h-2.5" strokeWidth={2} />}
      {label}
    </span>
  );
}