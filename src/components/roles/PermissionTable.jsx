import { Check, Minus, Settings } from 'lucide-react'
import { PERM_GROUPS } from '../../pages/RolesAndPermissions/RoleData'

export default function PermissionTable({ role }) {
  if (!role) return null
  var ICONS = { Settings: Settings }

  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Module</th>
            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Permissions</th>
            <th className="text-right px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {PERM_GROUPS.map(function(group) {
            var Icon = ICONS[group.icon] || Settings
            var granted = group.perms.filter(function(p) {
              return role.permissions === 'all' || (Array.isArray(role.permissions) && role.permissions.indexOf(group.key + '_' + p.toLowerCase().replace(/\s+/g, '_')) !== -1)
            }).length
            var full = granted === group.perms.length
            return (
              <tr key={group.key} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[12px] font-bold text-slate-700">{group.label}</span>
                    <span className="text-[9px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">{group.type}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {group.perms.map(function(perm) {
                      var ok = role.permissions === 'all' || (Array.isArray(role.permissions) && role.permissions.indexOf(group.key + '_' + perm.toLowerCase().replace(/\s+/g, '_')) !== -1)
                      return (
                        <span key={perm} className={'text-[9px] font-semibold px-1.5 py-0.5 rounded ' + (ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400 line-through')}>
                          {ok ? <Check className="w-2 h-2 inline mr-0.5" strokeWidth={3} /> : <Minus className="w-2 h-2 inline mr-0.5" strokeWidth={2} />}{perm}
                        </span>
                      )
                    })}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={'text-[9px] font-bold px-2 py-0.5 rounded-full ' + (full ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500')}>{granted}/{group.perms.length}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
