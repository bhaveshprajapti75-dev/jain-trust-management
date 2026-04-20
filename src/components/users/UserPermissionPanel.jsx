import { ShieldCheck } from 'lucide-react'
import PermissionChip from '../common/PermissionChip'
import { PERM_GROUPS, getCount, hasPerm } from '../../pages/RolesAndPermissions/RoleData'

export default function UserPermissionPanel({ role, extraPerms = [] }) {
  if (!role) return null

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50/70 px-4 py-3.5">
        <div className="flex items-center gap-2 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span className="text-[12px] font-semibold text-slate-700">Assigned Role:</span>
          <span className="text-[12px] font-semibold text-teal-700">{role.name}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">{role.type}</span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">{getCount(role)} base permissions</span>
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-sky-700">{extraPerms.length} extra permissions</span>
        </div>
      </div>

      {extraPerms.length ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
          <p className="text-[12px] font-semibold text-amber-700">Custom Permission Overrides</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {extraPerms.map(function(permissionKey) {
              return <PermissionChip key={permissionKey} label={permissionKey.split('_').slice(1).join(' ')} granted={true} />
            })}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PERM_GROUPS.map(function(group) {
          return (
            <div key={group.key} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] font-semibold text-slate-700">{group.label}</p>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{group.type}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.perms.map(function(permission) {
                  const permissionKey = group.key + '_' + permission.toLowerCase().replace(/\s+/g, '_')
                  const granted = hasPerm(role, permissionKey) || extraPerms.includes(permissionKey)
                  return <PermissionChip key={permissionKey} label={permission} granted={granted} />
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
