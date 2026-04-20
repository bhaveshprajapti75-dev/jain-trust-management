import { Check, Minus, Settings } from 'lucide-react'
import { ICONS, PERM_GROUPS, hasPerm } from './RoleData'

export default function PermissionGrid({ role, filterType }) {
  if (!role) return null
  var groups = filterType ? PERM_GROUPS.filter(function(g) { return g.type === filterType }) : PERM_GROUPS
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
      {groups.map(function(group) {
        var Icon = ICONS[group.icon] || Settings
        var activeCount = group.perms.filter(function(p) { return hasPerm(role, group.key + '_' + p.toLowerCase().replace(/\s+/g, '_')) }).length
        var full = activeCount === group.perms.length
        return (
          <div key={group.key} className={'border rounded-xl p-3 transition-all ' + (full ? 'border-teal-200 bg-teal-50/30' : 'border-slate-100 bg-white hover:border-slate-200')}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className={'w-5 h-5 rounded-md flex items-center justify-center ' + (full ? 'bg-teal-100' : 'bg-slate-100')}><Icon className={'w-3 h-3 ' + (full ? 'text-teal-600' : 'text-slate-400')} strokeWidth={2} /></div>
                <span className="font-bold text-[11px] text-slate-700">{group.label}</span>
              </div>
              <span className={'text-[9px] font-bold px-2 py-0.5 rounded-full ' + (full ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500')}>
                {activeCount}/{group.perms.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {group.perms.map(function(perm) {
                var ok = hasPerm(role, group.key + '_' + perm.toLowerCase().replace(/\s+/g, '_'))
                return <span key={perm} className={'text-[9px] font-semibold px-1.5 py-0.5 rounded-md ' + (ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-400 line-through')}>{ok ? <Check className="w-2 h-2 inline mr-0.5" strokeWidth={3} /> : <Minus className="w-2 h-2 inline mr-0.5" strokeWidth={2} />}{perm}</span>
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}


export const PermissionManager = PermissionGrid;
