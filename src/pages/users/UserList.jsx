import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Building2, CalendarDays, ChevronLeft, ChevronRight, FileText, Mail, Pencil, Phone, Plus, ShieldCheck, Trash2, Upload, Users, UserCheck, UserX } from 'lucide-react'
import Button from '../../components/ui/Button'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Modal from '../../components/ui/Modal'
import FilterBar from '../../components/ui/FilterBar'
import EmptyState from '../../components/ui/EmptyState'
import CommonPageLayout from '../../components/ui/CommonPageLayout'
import Input from '../../components/ui/Input'
import PermissionChip from '../../components/ui/PermissionChip'
import UserCard from '../../components/users/UserCard'
import UserDocuments from '../../components/users/UserDocuments'
import UserStatusToggle from '../../components/users/UserStatusToggle'
import SearchBar from '../../components/ui/SearchBar'
import Table from '../../components/ui/Table'
import { INITIAL_USERS, INITIAL_USER_DOCS, INITIAL_ACTIVITIES, getStatusCounts } from './userData'
import { getCount, hasPerm, INITIAL_ROLES, PERM_GROUPS } from '../RolesAndPermissions/RoleData'
import { INITIAL_TRUSTS, INITIAL_SANGHS, INITIAL_DEPARTMENTS } from '../organization/orgData'

const ITEMS_PER_PAGE = 6
const DOC_OPTIONS = ['Aadhaar Card', 'PAN Card', 'Photo', 'ID Card']
const DEFAULT_PROFILE_IMAGE = 'https://randomuser.me/api/portraits/men/32.jpg'

function getDisplayStatus(status) {
  return status === 'Suspended' ? 'Inactive' : status
}

function createInlineForm(user) {
  return {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    roleId: user?.roleId || '',
    trustId: user?.trustId || '',
    sanghId: user?.sanghId || '',
    departmentId: user?.departmentId || '',
    status: user?.status === 'Suspended' ? 'Inactive' : user?.status || 'Active',
    notes: user?.notes || '',
    avatar: user?.avatar || '',
    permissions: Array.isArray(user?.permissions) ? user.permissions : [],
    starterDocuments: Array.isArray(user?.starterDocuments) ? user.starterDocuments : [],
  }
}

function InfoTile({ label, value, icon }) {
  const Icon = icon
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="w-4 h-4" />
        <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-[12px] font-semibold text-slate-700 break-words">{value || '-'}</p>
    </div>
  )
}

function PermissionSummary({ role, extraPerms = [] }) {
  if (!role) return null

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50/70 px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span className="text-[12px] font-semibold text-slate-700">{role.name}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">{role.type}</span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
            {getCount(role)} / {extraPerms.length} extra
          </span>
        </div>
      </div>

      {extraPerms.length ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
          <p className="text-[12px] font-semibold text-amber-700">Added Permissions</p>
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
                <p className="text-[12px] font-semibold text-slate-700">{group.label}</p>
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

function InlineUserForm({ user, roles, trusts, sanghs, departments, onSave, onCancel }) {
  const [form, setForm] = useState(function() { return createInlineForm(user) })
  const [errors, setErrors] = useState({})
  const [permissionToAdd, setPermissionToAdd] = useState('')

  const availableSanghs = useMemo(function() {
    if (!form.trustId) return sanghs
    return sanghs.filter(function(item) { return Number(item.trustId) === Number(form.trustId) })
  }, [form.trustId, sanghs])

  const availableDepartments = useMemo(function() {
    return departments.filter(function(item) {
      const trustMatch = !form.trustId || Number(item.trustId) === Number(form.trustId)
      const sanghMatch = !form.sanghId || Number(item.sanghId) === Number(form.sanghId)
      return trustMatch && sanghMatch
    })
  }, [departments, form.sanghId, form.trustId])

  const selectedRole = useMemo(function() {
    return roles.find(function(role) { return Number(role.id) === Number(form.roleId) }) || null
  }, [form.roleId, roles])

  const availablePermissionOptions = useMemo(function() {
    return PERM_GROUPS.flatMap(function(group) {
      return group.perms.map(function(permission) {
        const key = group.key + '_' + permission.toLowerCase().replace(/\s+/g, '_')
        return { key, label: group.label + ' - ' + permission }
      })
    }).filter(function(item) {
      return !form.permissions.includes(item.key)
    })
  }, [form.permissions])

  function updateField(key, value) {
    setForm(function(current) {
      if (key === 'trustId') return { ...current, trustId: value, sanghId: '', departmentId: '' }
      if (key === 'sanghId') return { ...current, sanghId: value, departmentId: '' }
      return { ...current, [key]: value }
    })
  }

  function toggleStarterDocument(type) {
    setForm(function(current) {
      const exists = current.starterDocuments.includes(type)
      return {
        ...current,
        starterDocuments: exists
          ? current.starterDocuments.filter(function(item) { return item !== type })
          : current.starterDocuments.concat(type),
      }
    })
  }

  function togglePermission(permissionKey) {
    setForm(function(current) {
      const exists = current.permissions.includes(permissionKey)
      return {
        ...current,
        permissions: exists
          ? current.permissions.filter(function(item) { return item !== permissionKey })
          : current.permissions.concat(permissionKey),
      }
    })
  }

  function addPermission() {
    if (!permissionToAdd) return
    togglePermission(permissionToAdd)
    setPermissionToAdd('')
  }

  function handleAvatarChange(event) {
    const file = event.target.files && event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = function(loadEvent) {
      updateField('avatar', String(loadEvent.target?.result || ''))
    }
    reader.readAsDataURL(file)
  }

  function validate() {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Full name is required'
    if (!form.phone.trim()) nextErrors.phone = 'Phone number is required'
    if (!form.roleId) nextErrors.roleId = 'Role selection is required'
    if (!form.trustId) nextErrors.trustId = 'Trust selection is required'
    if (!form.sanghId) nextErrors.sanghId = 'Sangh selection is required'
    if (!form.departmentId) nextErrors.departmentId = 'Department selection is required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return
    onSave({
      ...form,
      roleId: Number(form.roleId),
      trustId: Number(form.trustId),
      sanghId: Number(form.sanghId),
      departmentId: Number(form.departmentId),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim(),
    })
  }

  const fieldClass = 'w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-50 focus:border-teal-500 transition-all font-medium'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-[22px] border border-teal-100 bg-gradient-to-r from-teal-50/80 via-white to-emerald-50/70 p-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
            <img src={form.avatar || DEFAULT_PROFILE_IMAGE} alt="Profile preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-slate-800">Profile Photo</p>
            <p className="text-[11px] text-slate-400 mt-1">Upload if you want custom image, otherwise default profile image will be used.</p>
          </div>
          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-[12px] font-semibold text-slate-600 hover:border-teal-200 hover:text-teal-700 cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            Upload
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input label="Full Name" required placeholder="Enter full name" value={form.name} onChange={function(event) { updateField('name', event.target.value) }} error={errors.name} />
        <Input label="Phone Number" required placeholder="+91 98765 43210" value={form.phone} onChange={function(event) { updateField('phone', event.target.value) }} error={errors.phone} />
        <Input label="Email Address" type="email" placeholder="name@organization.com" value={form.email} onChange={function(event) { updateField('email', event.target.value) }} error={errors.email} />
        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-600">Role <span className="text-rose-500">*</span></label>
          <select value={form.roleId} onChange={function(event) { updateField('roleId', event.target.value) }} className={fieldClass}>
            <option value="">Select role</option>
            {roles.map(function(role) { return <option key={role.id} value={role.id}>{role.name}</option> })}
          </select>
          {errors.roleId ? <p className="text-xs text-rose-500">{errors.roleId}</p> : null}
        </div>
        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-600">Trust <span className="text-rose-500">*</span></label>
          <select value={form.trustId} onChange={function(event) { updateField('trustId', event.target.value) }} className={fieldClass}>
            <option value="">Select trust</option>
            {trusts.map(function(trust) { return <option key={trust.id} value={trust.id}>{trust.name}</option> })}
          </select>
          {errors.trustId ? <p className="text-xs text-rose-500">{errors.trustId}</p> : null}
        </div>
        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-600">Sangh <span className="text-rose-500">*</span></label>
          <select value={form.sanghId} onChange={function(event) { updateField('sanghId', event.target.value) }} className={fieldClass}>
            <option value="">Select sangh</option>
            {availableSanghs.map(function(sangh) { return <option key={sangh.id} value={sangh.id}>{sangh.name}</option> })}
          </select>
          {errors.sanghId ? <p className="text-xs text-rose-500">{errors.sanghId}</p> : null}
        </div>
        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-600">Department <span className="text-rose-500">*</span></label>
          <select value={form.departmentId} onChange={function(event) { updateField('departmentId', event.target.value) }} className={fieldClass}>
            <option value="">Select department</option>
            {availableDepartments.map(function(department) { return <option key={department.id} value={department.id}>{department.name}</option> })}
          </select>
          {errors.departmentId ? <p className="text-xs text-rose-500">{errors.departmentId}</p> : null}
        </div>
        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-600">Status</label>
          <select value={form.status} onChange={function(event) { updateField('status', event.target.value) }} className={fieldClass}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-[13px] font-medium text-slate-600">Notes</label>
          <textarea rows={3} value={form.notes} onChange={function(event) { updateField('notes', event.target.value) }} placeholder="Add short notes..." className={`${fieldClass} resize-none`} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
            {selectedRole?.name || 'Select role'}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
            {selectedRole ? getCount(selectedRole) : 0} / {form.permissions.length} extra
          </span>
        </div>
        <div className="mt-3 flex flex-col md:flex-row gap-3">
          <select value={permissionToAdd} onChange={function(event) { setPermissionToAdd(event.target.value) }} className={fieldClass}>
            <option value="">Select extra permission</option>
            {availablePermissionOptions.map(function(option) {
              return <option key={option.key} value={option.key}>{option.label}</option>
            })}
          </select>
          <Button type="button" onClick={addPermission} disabled={!permissionToAdd}>Add</Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {form.permissions.length ? form.permissions.map(function(permissionKey) {
            return (
              <button key={permissionKey} type="button" onClick={function() { togglePermission(permissionKey) }}>
                <PermissionChip label={permissionKey.split('_').slice(1).join(' ')} granted={true} />
              </button>
            )
          }) : <div className="text-[12px] text-slate-400">No extra permissions selected.</div>}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-[13px] font-semibold text-slate-800">Starter Documents</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DOC_OPTIONS.map(function(type) {
            const selected = form.starterDocuments.includes(type)
            return (
              <button
                key={type}
                type="button"
                onClick={function() { toggleStarterDocument(type) }}
                className={`rounded-full px-3.5 py-2 text-[11px] font-semibold transition-all ${
                  selected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{user ? 'Save Changes' : 'Create User'}</Button>
      </div>
    </form>
  )
}

function InlineUserQuickView({ user, role, trust, department, status, documents, onEdit, onDelete, onDocUpload, onDocDelete, onStatusChange }) {
  const [activeTab, setActiveTab] = useState('Overview')
  if (!user) return null

  const tabs = ['Overview', 'Permissions', 'Documents']
  const statItems = [
    { label: 'Role', value: role?.name || '-', icon: ShieldCheck },
    { label: 'Trust', value: trust?.name || '-', icon: Building2 },
    { label: 'Documents', value: String(documents.length), icon: FileText },
    { label: 'Permissions', value: `${role ? getCount(role) : 0} / ${(user.permissions || []).length}`, icon: ShieldCheck },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <img src={user.avatar || DEFAULT_PROFILE_IMAGE} alt={user.name} className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
            <div className="min-w-0 space-y-1">
              <h2 className="text-[18px] font-bold text-slate-900 truncate">{user.name}</h2>
              <p className="text-[12px] font-medium text-slate-500">{role?.name || 'No role assigned'}</p>
              <div className="pt-1">
                <UserStatusToggle status={status} onChange={onStatusChange} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={onEdit} className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-all flex items-center justify-center">
              <Pencil className="w-4 h-4" />
            </button>
            <button type="button" onClick={onDelete} className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statItems.map(function(item) {
          return <InfoTile key={item.label} label={item.label} value={item.value} icon={item.icon} />
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-2 flex flex-wrap gap-2">
        {tabs.map(function(tab) {
          return (
            <button
              key={tab}
              type="button"
              onClick={function() { setActiveTab(tab) }}
              className={`px-4 py-2 rounded-xl text-[12px] font-medium transition-all ${
                activeTab === tab ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {activeTab === 'Overview' ? (
        <div className="grid grid-cols-2 gap-3">
          <InfoTile label="Email" value={user.email} icon={Mail} />
          <InfoTile label="Phone" value={user.phone} icon={Phone} />
          <InfoTile label="Joined" value={user.joined} icon={CalendarDays} />
          <InfoTile label="Department" value={department?.name || '-'} icon={FileText} />
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Notes</p>
            <p className="mt-2 text-[12px] leading-6 text-slate-600">{user.notes || 'No note added yet.'}</p>
          </div>
        </div>
      ) : null}

      {activeTab === 'Permissions' ? <PermissionSummary role={role} extraPerms={user.permissions || []} /> : null}

      {activeTab === 'Documents' ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <UserDocuments documents={documents} onUpload={onDocUpload} onDelete={onDocDelete} />
        </div>
      ) : null}
    </div>
  )
}

export default function UserList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState(function() {
    try {
      const stored = localStorage.getItem('users_full')
      return stored ? JSON.parse(stored) : INITIAL_USERS
    } catch {
      return INITIAL_USERS
    }
  })
  const [docs, setDocs] = useState(function() {
    try {
      const stored = localStorage.getItem('user_docs')
      return stored ? JSON.parse(stored) : INITIAL_USER_DOCS
    } catch {
      return INITIAL_USER_DOCS
    }
  })
  const [activities, setActivities] = useState(function() {
    try {
      const stored = localStorage.getItem('user_activities')
      return stored ? JSON.parse(stored) : INITIAL_ACTIVITIES
    } catch {
      return INITIAL_ACTIVITIES
    }
  })
  const [roles] = useState(function() {
    try {
      const stored = localStorage.getItem('rp_roles')
      return stored ? JSON.parse(stored) : INITIAL_ROLES
    } catch {
      return INITIAL_ROLES
    }
  })
  const [trusts] = useState(function() {
    try {
      const stored = localStorage.getItem('org_trusts')
      return stored ? JSON.parse(stored) : INITIAL_TRUSTS
    } catch {
      return INITIAL_TRUSTS
    }
  })
  const [sanghs] = useState(function() {
    try {
      const stored = localStorage.getItem('org_sanghs')
      return stored ? JSON.parse(stored) : INITIAL_SANGHS
    } catch {
      return INITIAL_SANGHS
    }
  })
  const [departments] = useState(function() {
    try {
      const stored = localStorage.getItem('org_departments')
      return stored ? JSON.parse(stored) : INITIAL_DEPARTMENTS
    } catch {
      return INITIAL_DEPARTMENTS
    }
  })

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(function() {
    localStorage.setItem('users_full', JSON.stringify(users))
  }, [users])

  useEffect(function() {
    localStorage.setItem('user_docs', JSON.stringify(docs))
  }, [docs])

  useEffect(function() {
    localStorage.setItem('user_activities', JSON.stringify(activities))
  }, [activities])

  const filteredUsers = useMemo(function() {
    return users.filter(function(user) {
      const query = search.toLowerCase()
      const role = roles.find(function(item) { return item.id === user.roleId })
      const status = getDisplayStatus(user.status)
      const matchesSearch = !query || [user.name, user.phone, user.email, role?.name].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })

      if (!matchesSearch) return false
      if (filters.role && Number(filters.role) !== user.roleId) return false
      if (filters.status && filters.status !== status) return false
      if (filters.trust && Number(filters.trust) !== user.trustId) return false
      if (filters.sangh && Number(filters.sangh) !== user.sanghId) return false
      return true
    })
  }, [filters, roles, search, users])

  const stats = useMemo(function() {
    const counts = getStatusCounts(users.map(function(user) {
      return { ...user, status: getDisplayStatus(user.status) }
    }))
    return [
      { title: 'Total Users', value: counts.Total, icon: Users, color: 'teal' },
      { title: 'Active', value: counts.Active, icon: UserCheck, color: 'emerald' },
      { title: 'Inactive', value: counts.Inactive, icon: UserX, color: 'sky' },
    ]
  }, [users])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageNumbers = useMemo(function() {
    return Array.from({ length: totalPages }, function(_, index) { return index + 1 })
  }, [totalPages])
  const visibleUsers = useMemo(function() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage, filteredUsers])

  const selectedUser = useMemo(function() {
    return users.find(function(user) { return user.id === selectedUserId }) || null
  }, [selectedUserId, users])

  const selectedRole = useMemo(function() {
    return selectedUser ? roles.find(function(item) { return item.id === selectedUser.roleId }) : null
  }, [roles, selectedUser])

  const selectedTrust = useMemo(function() {
    return selectedUser ? trusts.find(function(item) { return item.id === selectedUser.trustId }) : null
  }, [selectedUser, trusts])

  const selectedSangh = useMemo(function() {
    return selectedUser ? sanghs.find(function(item) { return item.id === selectedUser.sanghId }) : null
  }, [sanghs, selectedUser])

  const selectedDepartment = useMemo(function() {
    return selectedUser ? departments.find(function(item) { return item.id === selectedUser.departmentId }) : null
  }, [departments, selectedUser])

  const selectedDocs = useMemo(function() {
    return selectedUser ? docs.filter(function(item) { return item.userId === selectedUser.id }) : []
  }, [docs, selectedUser])

  const filterOptions = [
    { key: 'trust', placeholder: 'All Trusts', items: trusts.map(function(trust) { return { value: trust.id, label: trust.name } }) },
    { key: 'sangh', placeholder: 'All Sanghs', items: sanghs.map(function(sangh) { return { value: sangh.id, label: sangh.name } }) },
    { key: 'role', placeholder: 'All Roles', items: roles.map(function(role) { return { value: role.id, label: role.name } }) },
    { key: 'status', placeholder: 'All Status', items: ['Active', 'Inactive'] },
  ]

  function openAddModal() {
    setPage(1)
    setEditingUser(null)
    setShowModal(true)
  }

  function openEditModal(user) {
    setSelectedUserId(null)
    setEditingUser(user)
    setShowModal(true)
  }

  function closeModal() {
    setEditingUser(null)
    setShowModal(false)
  }

  function openUserDetails(user) {
    setSelectedUserId(user.id)
  }

  function closeUserDetails() {
    setSelectedUserId(null)
  }

  function handleSave(data) {
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
    const joinedDate = new Date().toISOString().split('T')[0]
    const starterDocuments = Array.isArray(data.starterDocuments) ? data.starterDocuments : []
    const userPayload = {
      ...data,
      starterDocuments: undefined,
    }

    if (editingUser) {
      setUsers(function(current) {
        return current.map(function(user) {
          return user.id === editingUser.id ? { ...user, ...userPayload } : user
        })
      })
      if (starterDocuments.length) {
        setDocs(function(current) {
          const existingTypes = current
            .filter(function(item) { return item.userId === editingUser.id })
            .map(function(item) { return item.type })
          const newDocs = starterDocuments
            .filter(function(type) { return !existingTypes.includes(type) })
            .map(function(type, index) {
              return {
                id: Date.now() + index,
                userId: editingUser.id,
                type,
                fileName: type.toLowerCase().replace(/\s+/g, '_') + '.pdf',
                status: 'Pending',
                uploadedDate: joinedDate,
                uploadDate: joinedDate,
                uploadedBy: 'Admin',
                notes: 'Added from edit user form',
              }
            })
          return current.concat(newDocs)
        })
      }
      setActivities(function(current) {
        return current.concat([{ id: Date.now(), userId: editingUser.id, action: 'updated', description: 'User details updated', doneBy: 'Admin', date: timestamp }])
      })
    } else {
      const nextId = users.reduce(function(maxId, user) { return Math.max(maxId, user.id) }, 0) + 1
      setUsers(function(current) {
        return current.concat([{ ...userPayload, id: nextId, joined: joinedDate, lastLogin: '-', committee: false }])
      })
      if (starterDocuments.length) {
        setDocs(function(current) {
          return current.concat(
            starterDocuments.map(function(type, index) {
              return {
                id: Date.now() + index,
                userId: nextId,
                type,
                fileName: type.toLowerCase().replace(/\s+/g, '_') + '.pdf',
                status: 'Pending',
                uploadedDate: joinedDate,
                uploadDate: joinedDate,
                uploadedBy: 'Admin',
                notes: 'Added during user creation',
              }
            })
          )
        })
      }
      setActivities(function(current) {
        return current.concat([{ id: Date.now(), userId: nextId, action: 'created', description: 'User created', doneBy: 'Admin', date: timestamp }])
      })
    }
    closeModal()
  }

  function handleStatusChange(nextStatus) {
    if (!selectedUser || nextStatus === selectedUser.status) return

    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setUsers(function(current) {
      return current.map(function(user) {
        return user.id === selectedUser.id ? { ...user, status: nextStatus } : user
      })
    })
    setActivities(function(current) {
      return current.concat([{
        id: Date.now(),
        userId: selectedUser.id,
        action: 'status_change',
        description: 'Status changed from ' + selectedUser.status + ' to ' + nextStatus,
        doneBy: 'Admin',
        date: timestamp,
      }])
    })
  }

  function handleDocUpload(docData) {
    if (!selectedUser) return
    const createdDate = new Date().toISOString().split('T')[0]
    setDocs(function(current) {
      return current.concat([{
        id: Date.now(),
        userId: selectedUser.id,
        type: docData.type,
        fileName: docData.type.toLowerCase().replace(/\s+/g, '_') + '.pdf',
        status: 'Pending',
        uploadedDate: createdDate,
        uploadDate: createdDate,
        uploadedBy: 'Admin',
        notes: docData.notes || '',
      }])
    })
    setActivities(function(current) {
      return current.concat([{
        id: Date.now() + 1,
        userId: selectedUser.id,
        action: 'updated',
        description: docData.type + ' document was added to the profile.',
        doneBy: 'Admin',
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      }])
    })
  }

  function handleDocDelete(docId) {
    if (!selectedUser) return
    setDocs(function(current) {
      return current.filter(function(item) { return item.id !== docId })
    })
  }

  function handleDelete() {
    setUsers(function(current) {
      return current.filter(function(user) { return user.id !== deleteId })
    })
    setDocs(function(current) {
      return current.filter(function(item) { return item.userId !== deleteId })
    })
    setActivities(function(current) {
      return current.filter(function(item) { return item.userId !== deleteId })
    })
    if (selectedUserId === deleteId) setSelectedUserId(null)
    setDeleteId(null)
  }

  return (
    <>
      <CommonPageLayout
        title="User Management"
        subtitle="Manage trust, sangh, accounts, and committee users within the current hierarchy."
        tabs={[
          { id: '/users/all', label: 'All Users' },
          { id: '/members/families', label: 'Families' },
          { id: '/members/individual', label: 'Individuals' },
          { id: '/members/committee', label: 'Committee' },
          { id: '/staff/dept', label: 'Departments' },
          { id: '/staff/members', label: 'Staff' },
        ]}
        activeTab={location.pathname}
        onTabChange={(tabId) => navigate(tabId)}
        action={<Button icon={Plus} onClick={openAddModal}>Add User</Button>}
        stats={stats}
        isEmpty={!filteredUsers.length}
        emptyState={<EmptyState message="No users found" description="Adjust the filters or add a user to the selected trust or sangh." icon={Users} action={<Button variant="secondary" size="sm" icon={Plus} onClick={openAddModal}>Add User</Button>} />}
      >
      <div className="w-full relative bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
          <div className="relative w-full md:w-80 group">
            <SearchBar 
              value={search} 
              onChange={function(value) {
                setPage(1)
                setSearch(value)
              }} 
              placeholder="Search by name, phone, email, or role..." 
            />
          </div>
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end relative">
            <FilterBar 
              filters={filters} 
              options={filterOptions} 
              onChange={function(key, value) { 
                setPage(1); 
                setFilters({ ...filters, [key]: value }) 
              }} 
              onClear={function() { 
                setPage(1); 
                setFilters({}); 
                setSearch('') 
              }} 
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <Table 
          columns={[
            {
              key: 'srNo',
              label: 'Sr. No.',
              align: 'left',
              render: (_, __, i) => <span className="text-[12.5px] font-medium text-slate-500">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</span>
            },
            {
              key: 'userInfo',
              label: 'User Info',
              align: 'center',
              render: (_, user) => (
                <div className="flex items-center gap-3 py-1 justify-center">
                  <img src={user.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                  <div className="text-left">
                    <p className="text-[12.5px] font-bold text-slate-800 transition-colors">{user.name}</p>
                    <p className="text-[11.5px] font-medium text-slate-500">{user.email || user.phone}</p>
                  </div>
                </div>
              )
            },
            {
              key: 'role',
              label: 'Role & Permissions',
              align: 'center',
              render: (_, user) => {
                const role = roles.find(item => item.id === user.roleId)
                return (
                  <div className="flex flex-col gap-1 items-center text-center">
                    <span className="text-[12.5px] font-bold text-slate-700">{role?.name || '-'}</span>
                    <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">{role?.type || 'No Role'}</span>
                  </div>
                )
              }
            },
            {
              key: 'entity',
              label: 'Assigned Entity',
              align: 'center',
              render: (_, user) => {
                const trust = trusts.find(item => item.id === user.trustId)
                const sangh = sanghs.find(item => item.id === user.sanghId)
                return (
                  <div className="flex flex-col gap-1 items-center text-center">
                    <span className="text-[12.5px] font-bold text-slate-700">{trust?.name || 'All Trusts'}</span>
                    {sangh ? <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100 w-fit">{sangh.name}</span> : null}
                  </div>
                )
              }
            },
            {
              key: 'status',
              label: 'Status',
              align: 'center',
              render: (_, user) => {
                const displayStatus = getDisplayStatus(user.status)
                return (
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${displayStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${displayStatus === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {displayStatus}
                    </span>
                  </div>
                )
              }
            },
            {
              key: 'actions',
              label: 'Actions',
              align: 'center',
              render: (_, user) => (
                <div className="flex items-center justify-center gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 border border-transparent hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all duration-200"
                    onClick={(e) => { e.stopPropagation(); openEditModal(user); }}
                  >
                    <Pencil size={15} strokeWidth={2} />
                  </button>
                </div>
              )
            }
          ]}
          data={visibleUsers}
          onRowClick={(user) => openUserDetails(user)}
          skipCard={true}
        />
      </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-[13px] text-slate-500">
            {filteredUsers.length ? (
              <>
                  Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>
                  -
                  <span className="font-semibold text-slate-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span>
                  {' '}of <span className="font-semibold text-slate-700">{filteredUsers.length}</span> users
                </>
              ) : (
                <>
                  <span className="font-semibold text-slate-700">0</span> of <span className="font-semibold text-slate-700">0</span> users
                </>
              )}
            </p>
            {filteredUsers.length > ITEMS_PER_PAGE ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={function() { setPage(function(value) { return Math.max(1, value - 1) }) }}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 flex items-center justify-center transition-all hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {pageNumbers.map(function(pageNumber) {
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={function() { setPage(pageNumber) }}
                      className={`min-w-[40px] h-10 rounded-xl px-3 text-[12px] font-semibold transition-all ${
                        currentPage === pageNumber
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={function() { setPage(function(value) { return Math.min(totalPages, value + 1) }) }}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 flex items-center justify-center transition-all hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </CommonPageLayout>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingUser ? 'Edit User' : 'Add User'}
        subtitle={editingUser ? 'Update the selected user profile with the latest organization details.' : 'Create a clean user profile that matches your trust and sangh structure.'}
        size="xl"
      >
        <InlineUserForm user={editingUser} roles={roles} trusts={trusts} sanghs={sanghs} departments={departments} onSave={handleSave} onCancel={closeModal} />
      </Modal>

      <Modal
        isOpen={!!selectedUser}
        onClose={closeUserDetails}
        title="User Details"
        subtitle="Review the profile, update status, and open the full edit form from here."
        size="lg"
      >
        <InlineUserQuickView
          user={selectedUser}
          role={selectedRole}
          trust={selectedTrust}
          sangh={selectedSangh}
          department={selectedDepartment}
          status={selectedUser ? getDisplayStatus(selectedUser.status) : 'Inactive'}
          documents={selectedDocs}
          onEdit={function() {
            if (!selectedUser) return
            closeUserDetails()
            openEditModal(selectedUser)
          }}
          onDelete={function() {
            if (!selectedUser) return
            setDeleteId(selectedUser.id)
          }}
          onDocUpload={handleDocUpload}
          onDocDelete={handleDocDelete}
          onStatusChange={handleStatusChange}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={function() { setDeleteId(null) }}
        onConfirm={handleDelete}
        title="Delete User?"
        message="This user and its related documents will be removed from the current list."
      />
    </>
  )
}

