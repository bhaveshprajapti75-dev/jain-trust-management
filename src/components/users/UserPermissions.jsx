import { ShieldCheck } from 'lucide-react'
import PermissionChip from '../ui/PermissionChip'
import { PERM_GROUPS, hasPerm } from '../../pages/RolesAndPermissions/RoleData'

export default function UserPermissions({ role, extraPerms }) {
  if (!role) return null;

  // મોક પરમિશન ગૃપ્સ (જે આપણે ટેસ્ટિંગ માટે વાપરીશું)
  const permGroups = [
    { key: 'users', label: 'User Management', perms: ['Create', 'Read', 'Update', 'Delete'] },
    { key: 'donations', label: 'Donation System', perms: ['Create', 'Read', 'Update'] }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[12px] font-bold text-slate-700">Assigned Role:</span>
        <span className="text-[12px] font-bold text-teal-600">{role.name}</span>
        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{role.type}</span>
      </div>

      {extraPerms && extraPerms.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p className="text-[11px] font-bold text-amber-700 mb-2">Custom Permission Overrides</p>
          <div className="flex flex-wrap gap-1">
            {extraPerms.map((p, i) => (
              <PermissionChip key={i} label={p} granted={true} size="xs" />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {permGroups.map((group) => (
          <div key={group.key} className="border border-slate-100 bg-white rounded-xl p-3 hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-slate-100">
                <Settings className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
              </div>
              <span className="text-[12px] font-bold text-slate-700">{group.label}</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {group.perms.map((perm, index) => (
                <PermissionChip key={index} label={perm} granted={true} size="xs" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
