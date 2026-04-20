import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import CommonPageLayout from '../../components/common/CommonPageLayout'
import { INITIAL_ROLES, PERM_GROUPS, hasPerm } from './RoleData'

export default function RolesAndPermissionsPage() {
  const [moduleSearch, setModuleSearch] = useState('')
  const [roles] = useState(function() {
    try {
      const stored = localStorage.getItem('rp_roles')
      return stored ? JSON.parse(stored) : INITIAL_ROLES
    } catch {
      return INITIAL_ROLES
    }
  })
  
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id || null)
  const [openDropdown, setOpenDropdown] = useState(null)
  
  const selectedRole = roles.find(role => role.id === selectedRoleId) || roles[0] || null

  const filteredGroups = useMemo(() => {
    if (!moduleSearch.trim()) return PERM_GROUPS;
    return PERM_GROUPS.filter(group => group.label.toLowerCase().includes(moduleSearch.toLowerCase()));
  }, [moduleSearch])

  return (
    <CommonPageLayout
      title="Permission Management"
      subtitle="Customize access levels and operational rights securely."
      contentClassName="p-0"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Block */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 z-10 sticky top-0">
          <div>
            <h2 className="text-[16px] font-bold text-slate-800">Customize Role Permissions</h2>
            <p className="text-[13px] text-slate-500 mt-1">Choose a role and set access levels module by module.</p>
          </div>
          <div className="px-3 py-1.5 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 text-[12px] font-bold">
            {filteredGroups.length} modules visible
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Search Module Input */}
          <div>
            <label className="text-[12px] font-extrabold text-slate-700 mb-2 block uppercase tracking-wide">Search Module</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] outline-none focus:border-emerald-500 transition-all text-slate-700 placeholder-slate-400 font-medium"
              placeholder="Type module name..."
              value={moduleSearch}
              onChange={(e) => setModuleSearch(e.target.value)}
            />
          </div>

          {/* Roles Pills */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            {roles.map(role => (
              <button 
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`px-4 py-2 rounded-full text-[13.5px] font-bold transition-all ${selectedRole?.id === role.id ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}
              >
                {role.name}
              </button>
            ))}
          </div>

          {/* Subtitle Bar */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-[13px] text-slate-500 font-medium my-2 flex items-center gap-2">
            Editing permissions for: <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">{selectedRole?.name}</span>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
            {filteredGroups.length === 0 ? (
              <div className="col-span-1 lg:col-span-2 text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-[14px] text-slate-500 font-medium">No modules found matching "{moduleSearch}"</p>
              </div>
            ) : (
              filteredGroups.map(group => {
                const allowedCount = group.perms.filter(p => hasPerm(selectedRole, group.key + '_' + p.toLowerCase().replace(/\s+/g, '_'))).length;
                const isFull = allowedCount === group.perms.length && group.perms.length > 0;
                const isNone = allowedCount === 0;
                const level = isFull ? 'Full Control' : isNone ? 'No Access' : 'Custom';
                
                return (
                  <div key={group.key} className={`relative border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-white w-full shadow-sm transition-colors gap-3 z-10 ${openDropdown === group.key ? 'border-emerald-500 z-20' : 'border-slate-200 hover:border-emerald-300'}`}>
                     <div className="flex items-center gap-2.5 flex-wrap flex-1">
                       <span className="font-bold text-slate-800 text-[14px]">{group.label} Management</span>
                       <span className="text-[9.5px] font-black bg-slate-100 border border-slate-200 text-slate-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Inherited</span>
                     </div>
                     <div className="relative shrink-0 w-full sm:w-[160px]">
                       <div 
                         onClick={() => setOpenDropdown(openDropdown === group.key ? null : group.key)}
                         className={`w-full border rounded-lg pl-3 pr-3 py-2 text-[13px] bg-white font-bold text-slate-700 outline-none cursor-pointer transition-colors flex items-center justify-between shadow-sm ${openDropdown === group.key ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200 hover:border-emerald-500'}`}
                       >
                         <span>{level}</span>
                         <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openDropdown === group.key ? 'rotate-180' : ''}`} strokeWidth={3} />
                       </div>
                       
                       {openDropdown === group.key && (
                         <div className="absolute top-full right-0 mt-1.5 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1.5 overflow-hidden">
                           {['Full Control', 'View Only', 'Custom', 'No Access'].map(opt => (
                             <div 
                               key={opt}
                               onClick={() => setOpenDropdown(null)}
                               className={`px-3.5 py-2 text-[13px] font-medium cursor-pointer transition-colors ${level === opt ? 'bg-emerald-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                             >
                               {opt}
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                  </div>
                )
              })
            )}
          </div>
          
        </div>
      </div>
    </CommonPageLayout>
  )
}
