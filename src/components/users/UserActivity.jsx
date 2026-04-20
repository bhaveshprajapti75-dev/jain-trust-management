import React from 'react';
import { UserPlus, LogIn, ToggleLeft, Pencil } from 'lucide-react';

const ACTION_ICON = {
  status_change: ToggleLeft,
  login: LogIn,
  created: UserPlus,
  updated: Pencil
};

const ACTION_CLR = {
  status_change: 'text-amber-500 bg-amber-50',
  login: 'text-slate-400 bg-slate-50',
  created: 'text-emerald-500 bg-emerald-50',
  updated: 'text-sky-500 bg-sky-50'
};

export default function UserActivity({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
        <p className="text-[12px] text-slate-400 font-medium">No activity recorded yet</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-4">
      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-slate-200" />
      
      {activities.map((act) => {
        const Icon = ACTION_ICON[act.action] || Pencil;
        const clr = ACTION_CLR[act.action] || 'text-slate-500 bg-slate-50';
        const title = act.title || (act.action === 'status_change' ? 'Status Updated' : act.action === 'login' ? 'User Login' : act.action === 'created' ? 'User Created' : act.action === 'updated' ? 'Profile Updated' : 'Activity Logged');
        const description = act.desc || act.description || 'No details available';
        const time = act.time || act.date || '-';
        
        return (
          <div key={act.id} className="relative flex items-start gap-3">
            <div className={`absolute -left-[23px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${clr} shadow-sm`}>
              <Icon className="w-2.5 h-2.5" strokeWidth={2.5} />
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 flex-1 hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between gap-3 mb-1">
                <p className="text-[12px] font-bold text-slate-700">{title}</p>
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{time}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{description}</p>
              {act.doneBy ? <p className="text-[10px] text-slate-400 font-medium mt-2">Updated by {act.doneBy}</p> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
