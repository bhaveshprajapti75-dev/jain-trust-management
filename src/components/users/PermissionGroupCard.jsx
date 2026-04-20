import React from 'react'
import { ShieldCheck } from 'lucide-react'

export default function PermissionGroupCard({ title, type, permissions = [] }) {
  return (
    <div className="border border-slate-200 rounded-2xl p-4 bg-white">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <p className="text-[13px] font-bold text-slate-800">{title}</p>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          {type}
        </span>
      </div>
      
      <div className="space-y-2">
        {permissions.map((perm, index) => (
          <div key={index} className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${perm.granted ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <span className={`text-[12px] ${perm.granted ? 'font-bold text-slate-800' : 'font-medium text-slate-400'}`}>
              {perm.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
