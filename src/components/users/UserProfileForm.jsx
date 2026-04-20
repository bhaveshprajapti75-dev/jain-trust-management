import { useMemo, useState } from 'react'
import { Upload } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import PermissionChip from '../ui/PermissionChip'
import { getCount, PERM_GROUPS } from '../../pages/RolesAndPermissions/RoleData'

const DOC_OPTIONS = ['Aadhaar Card', 'PAN Card', 'Photo', 'ID Card']

function createInitialForm(user) {
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

export default function UserProfileForm({ user, roles = [], trusts = [], sanghs = [], departments = [], onSave, onCancel }) {
  const [form, setForm] = useState(function() { return createInitialForm(user) })
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
        return {
          key,
          label: group.label + ' - ' + permission,
        }
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
      avatar: form.avatar,
      permissions: form.permissions,
      starterDocuments: form.starterDocuments,
    })
  }

  const fieldClass = 'w-full px-3.5 py-3 bg-white border border-slate-200 rounded-2xl text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-50 focus:border-teal-500 transition-all font-medium shadow-sm shadow-slate-100/60'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-[24px] border border-teal-100 bg-gradient-to-r from-teal-50/80 via-white to-emerald-50/70 p-5 shadow-sm shadow-teal-100/40">
        <h3 className="text-[15px] font-semibold text-slate-800">{user ? 'Update user profile' : 'Create a new user profile'}</h3>
        <p className="text-[12px] text-slate-500 mt-1.5 leading-5">
          Keep the profile mapped to the correct role, trust, sangh, and department for smoother day-to-day management.
        </p>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h4 className="text-[13px] font-semibold text-slate-800">Basic Details</h4>
          <p className="text-[12px] text-slate-400 mt-1">Add the core information first so the profile is easy to identify later.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 rounded-[22px] border border-dashed border-teal-200 bg-gradient-to-r from-slate-50 to-teal-50/60 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 via-emerald-50 to-white border border-teal-100 text-teal-700 font-bold flex items-center justify-center overflow-hidden shadow-sm">
              {form.avatar ? (
                <img src={form.avatar} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[18px]">{String(form.name || 'User').split(' ').map(function(part) { return part[0] || '' }).join('').toUpperCase().slice(0, 2)}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-slate-800">Profile Photo</p>
              <p className="text-[12px] text-slate-400 mt-1">Upload a user photo if available. Otherwise the initials badge will be used.</p>
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-[12px] font-semibold text-slate-600 hover:border-teal-200 hover:text-teal-700 cursor-pointer transition-all shadow-sm">
              <Upload className="w-4 h-4" />
              Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
        </div>
        <Input
          label="Full Name"
          required
          placeholder="Enter full name"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          error={errors.name}
        />
        <Input
          label="Phone Number"
          required
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          error={errors.phone}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="name@organization.com"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          error={errors.email}
        />
        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-600">Role <span className="text-rose-500">*</span></label>
          <select value={form.roleId} onChange={(event) => updateField('roleId', event.target.value)} className={fieldClass}>
            <option value="">Select role</option>
            {roles.map(function(role) {
              return <option key={role.id} value={role.id}>{role.name}</option>
            })}
          </select>
          {errors.roleId ? <p className="text-xs text-rose-500">{errors.roleId}</p> : null}
        </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h4 className="text-[13px] font-semibold text-slate-800">Organization Mapping</h4>
          <p className="text-[12px] text-slate-400 mt-1">Connect this user with the proper trust, sangh, and department.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-600">Trust <span className="text-rose-500">*</span></label>
          <select value={form.trustId} onChange={(event) => updateField('trustId', event.target.value)} className={fieldClass}>
            <option value="">Select trust</option>
            {trusts.map(function(trust) {
              return <option key={trust.id} value={trust.id}>{trust.name}</option>
            })}
          </select>
          {errors.trustId ? <p className="text-xs text-rose-500">{errors.trustId}</p> : null}
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-600">Sangh <span className="text-rose-500">*</span></label>
          <select value={form.sanghId} onChange={(event) => updateField('sanghId', event.target.value)} className={fieldClass}>
            <option value="">Select sangh</option>
            {availableSanghs.map(function(sangh) {
              return <option key={sangh.id} value={sangh.id}>{sangh.name}</option>
            })}
          </select>
          {errors.sanghId ? <p className="text-xs text-rose-500">{errors.sanghId}</p> : null}
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-600">Department <span className="text-rose-500">*</span></label>
          <select value={form.departmentId} onChange={(event) => updateField('departmentId', event.target.value)} className={fieldClass}>
            <option value="">Select department</option>
            {availableDepartments.map(function(department) {
              return <option key={department.id} value={department.id}>{department.name}</option>
            })}
          </select>
          {errors.departmentId ? <p className="text-xs text-rose-500">{errors.departmentId}</p> : null}
        </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h4 className="text-[13px] font-semibold text-slate-800">Profile Preferences</h4>
          <p className="text-[12px] text-slate-400 mt-1">Keep the current status and any useful internal notes together.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-[13px] font-medium text-slate-600">Status</label>
          <select value={form.status} onChange={(event) => updateField('status', event.target.value)} className={fieldClass}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-[13px] font-medium text-slate-600">Notes</label>
          <textarea
            rows={4}
            placeholder="Add internal notes, team context, or onboarding remarks..."
            value={form.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            className={`${fieldClass} resize-none`}
          />
        </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h4 className="text-[13px] font-semibold text-slate-800">Permissions</h4>
          <p className="text-[12px] text-slate-400 mt-1">Keep base role permissions simple, and add only the extra access you need.</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 border border-slate-200">
              Role: {selectedRole?.name || 'Select role first'}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              {selectedRole ? getCount(selectedRole) : 0} base permissions
            </span>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">
              {form.permissions.length} extra permissions
            </span>
          </div>
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <select value={permissionToAdd} onChange={function(event) { setPermissionToAdd(event.target.value) }} className={fieldClass}>
            <option value="">Select extra permission</option>
            {availablePermissionOptions.map(function(option) {
              return <option key={option.key} value={option.key}>{option.label}</option>
            })}
          </select>
          <Button type="button" onClick={addPermission} disabled={!permissionToAdd}>Add Permission</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {form.permissions.length ? form.permissions.map(function(permissionKey) {
            return (
              <button key={permissionKey} type="button" onClick={function() { togglePermission(permissionKey) }}>
                <PermissionChip label={permissionKey.split('_').slice(1).join(' ')} granted={true} />
              </button>
            )
          }) : (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-[12px] text-slate-400">
              No extra permissions selected.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h4 className="text-[13px] font-semibold text-slate-800">Starter Documents</h4>
          <p className="text-[12px] text-slate-400 mt-1">Select the documents that should be created with this user profile.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {DOC_OPTIONS.map(function(type) {
            const selected = form.starterDocuments.includes(type)
            return (
              <button
                key={type}
                type="button"
                onClick={function() { toggleStarterDocument(type) }}
                className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-all ${
                  selected
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{user ? 'Save Changes' : 'Create User'}</Button>
      </div>
    </form>
  )
}
