import React from 'react';
import { ShieldOff } from 'lucide-react';

export default function NoPermission({ title, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
        <ShieldOff className="w-7 h-7 text-slate-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-[15px] font-bold text-slate-600 mb-1">{title || 'Access Denied'}</h3>
      <p className="text-[13px] text-slate-400 text-center max-w-xs leading-relaxed">{message || 'You do not have permission to view this page. Contact your administrator.'}</p>
    </div>
  );
}