import React from 'react';
import { Building2, MapPin, Users } from 'lucide-react';
// Correct Named Imports
import { INITIAL_SANGHS, getTrustName } from './orgData';

export default function Sangh() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_SANGHS.map((sangh) => (
          <div key={sangh.id} className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-all">
                <Users size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${sangh.type === 'Main' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                {sangh.type}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 leading-tight">{sangh.name}</h3>
            
            <div className="mt-4 space-y-2">
              {/* Using getTrustName function here */}
              <div className="flex items-center gap-2 text-slate-500">
                <Building2 size={14} className="text-emerald-500" />
                <span className="text-xs font-semibold">{getTrustName(sangh.trustId)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={14} />
                <span className="text-xs font-medium uppercase tracking-wide">{sangh.city}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Members</p>
              <p className="text-sm font-black text-slate-700">{sangh.members.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}