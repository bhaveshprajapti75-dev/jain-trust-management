import React from 'react';
import { Building2, Users, Link2 } from 'lucide-react';
import StatCard from '../../components/common/StatCard';

export default function OrgOverview({ stats }) {
  const items = [
    { title: 'Total Trusts', value: stats.trusts || 0, icon: Building2, color: 'emerald' },
    { title: 'Total Sanghs', value: stats.sanghs || 0, icon: Users, color: 'teal' },
    { title: 'Total Linked', value: stats.links || 0, icon: Link2, color: 'emerald' },
  ];

  return (
    <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {items.map((s) => (
        <div key={s.title} className="flex-1 min-w-[160px]">
          <StatCard 
            title={s.title} 
            value={s.value.toString()} 
            icon={s.icon} 
            color={s.color}
            className="hover:border-teal-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1"
          />
        </div>
      ))}
    </div>
  );
}