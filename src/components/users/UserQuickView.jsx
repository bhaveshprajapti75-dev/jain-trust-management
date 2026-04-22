import { useMemo, useState } from 'react'
import { Building2, CalendarDays, Clock3, FileText, Mail, Pencil, Phone, ShieldCheck, Trash2, Users } from 'lucide-react'
import PermissionChip from '../ui/PermissionChip'
import StatusBadge from '../ui/StatusBadge'
import UserAvatar from './UserAvatar'
import UserDocuments from './UserDocuments'
import UserStatusToggle from './UserStatusToggle'
import { PERM_GROUPS, getCount, hasPerm } from '../../pages/RolesAndPermissions/RoleData'

function InfoTile({ label, value, icon }) {
  const Icon = icon
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="w-4 h-4" />
        <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-[12px] font-semibold text-slate-700 break-words">{value || '-'}</p>
    </div>
  )
}

function PermissionSummary({ role, extraPerms = [] }) {
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
          <p className="text-[12px] font-semibold text-amber-700">Extra Permissions</p>
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

export default function UserQuickView({
  user,
  role,
  trust,
  sangh,
  department,
  status,
  documents = [],
  onEdit,
  onDelete,
  onDocUpload,
  onDocDelete,
  onStatusChange,
}) {
  const [activeTab, setActiveTab] = useState('Overview')
  const statItems = useMemo(function() {
    return [
      { label: 'Role Access', value: role?.name || '-', icon: ShieldCheck },
      { label: 'Documents', value: String(documents.length), icon: FileText },
      { label: 'Permissions', value: String((user?.permissions || []).length), icon: ShieldCheck },
      { label: 'Status', value: status, icon: Users },
    ]
  }, [documents.length, role?.name, status, user?.permissions])
  const tabs = ['Overview', 'Permissions', 'Documents']

  if (!user) return null

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50/70 p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="flex items-start gap-4">
            <UserAvatar user={user} size="lg" preferImage={true} />
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[22px] font-bold text-slate-900">{user.name}</h2>
                <StatusBadge status={status} size="md" />
              </div>
              <p className="text-[13px] font-semibold text-teal-700">{role?.name || 'No role assigned'}</p>
              <p className="text-[13px] text-slate-500 leading-6 max-w-2xl">
                {user.notes || 'No internal note has been added for this user yet.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-3 lg:min-w-[290px]">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Status Control</p>
              <div className="mt-3">
                <UserStatusToggle status={status} onChange={onStatusChange} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={onEdit} className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-all flex items-center justify-center">
                <Pencil className="w-4 h-4" />
              </button>
              <button type="button" onClick={onDelete} className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {statItems.map(function(item) {
          return <InfoTile key={item.label} label={item.label} value={item.value} icon={item.icon} />
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm flex flex-wrap gap-2">
        {tabs.map(function(tab) {
          return (
            <button
              key={tab}
              type="button"
              onClick={function() { setActiveTab(tab) }}
              className={`px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all ${
                activeTab === tab
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {activeTab === 'Overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <InfoTile label="Trust" value={trust?.name} icon={Building2} />
          <InfoTile label="Sangh" value={sangh?.name} icon={Users} />
          <InfoTile label="Department" value={department?.name} icon={FileText} />
          <InfoTile label="Joined On" value={user.joined} icon={CalendarDays} />
          <InfoTile label="Email Address" value={user.email} icon={Mail} />
          <InfoTile label="Phone Number" value={user.phone} icon={Phone} />
          <InfoTile label="Last Login" value={user.lastLogin || 'Never'} icon={Clock3} />
          <InfoTile label="Committee" value={user.committee ? user.committeeRole || 'Committee Member' : 'Not assigned'} icon={Users} />
          <div className="md:col-span-2 xl:col-span-4 rounded-[24px] border border-slate-200 bg-white p-5">
            <h3 className="text-[14px] font-semibold text-slate-800">Notes</h3>
            <p className="mt-3 text-[12px] leading-6 text-slate-500">
              {user.notes || 'No internal note has been added for this user yet.'}
            </p>
          </div>
        </div>
      ) : null}

      {activeTab === 'Permissions' ? (
        <PermissionSummary role={role} extraPerms={user.permissions || []} />
      ) : null}

      {activeTab === 'Documents' ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <UserDocuments documents={documents} onUpload={onDocUpload} onDelete={onDocDelete} />
        </div>
      ) : null}

    </div>
  )
}
