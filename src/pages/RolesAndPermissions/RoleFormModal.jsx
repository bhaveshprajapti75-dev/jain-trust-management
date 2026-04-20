import React, { useState, useEffect, useMemo } from 'react'
import { Shield, Users, Landmark, ArrowLeft, Save, Lock, ShieldCheck, Settings } from 'lucide-react'
import { getPermsByType, getFullPermKeysForType, ICONS, permsToNested, nestedToPerms, PERM_GROUPS, getTotalPerms } from './RoleData'
import { PermissionManager } from './PermissionGrid'

var TYPE_OPTIONS = [
  { value: 'System', label: 'System', icon: Shield },
  { value: 'Sangh',  label: 'Sangh',  icon: Users },
  { value: 'Trust',  label: 'Trust',  icon: Landmark },
]
var TYPE_CLR = {
  System: { bg: 'bg-sky-50', icon: 'text-sky-600', border: 'border-sky-200', active: 'bg-sky-600 text-white border-transparent shadow-sm' },
  Sangh:  { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-200', active: 'bg-emerald-600 text-white border-transparent shadow-sm' },
  Trust:  { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-200', active: 'bg-rose-600 text-white border-transparent shadow-sm' },
}
var inputCls = 'w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 transition-all font-medium'
var labelCls = 'text-[13px] font-bold text-slate-700 mb-1.5 block'

var PermGroupCard = React.memo(function(props) {
  var group = props.group
  var customPerms = props.customPerms
  var Icon = ICONS[group.icon] || Settings
  var activeCount = group.perms.filter(function(p) { return customPerms[group.key] && customPerms[group.key][p] }).length
  var full = activeCount === group.perms.length

  return (
    <div className={'border rounded-xl p-3 transition-all ' + (full ? 'border-teal-200 bg-teal-50/30' : 'border-slate-100 bg-white hover:border-slate-200')}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={'w-6 h-6 rounded-md flex items-center justify-center ' + (full ? 'bg-teal-100' : 'bg-slate-100')}>
            <Icon className={'w-3 h-3 ' + (full ? 'text-teal-600' : 'text-slate-400')} strokeWidth={2} />
          </div>
          <span className="font-bold text-[11px] text-slate-700 truncate">{group.label}</span>
        </div>
        <button type="button" onClick={function() { props.onToggleGroupAll(group) }} className={'text-[9px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer ' + (full ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}>
          {full ? 'All On' : 'Select All'}
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {group.perms.map(function(perm) {
          var enabled = !!(customPerms[group.key] && customPerms[group.key][perm])
          return (
            <button key={perm} type="button" onClick={function() { props.onTogglePerm(group.key, perm) }} className={'text-[10px] font-semibold px-2 py-0.5 rounded-md transition-all cursor-pointer ' + (enabled ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-50 text-slate-400 hover:bg-slate-100')}>
              {enabled ? '✓ ' : ''}{perm}
            </button>
          )
        })}
      </div>
      <p className="text-[9px] text-slate-500 mt-1 leading-tight">{group.label}</p>
    </div>
  )
})
PermGroupCard.displayName = 'PermGroupCard'

export default function RoleFormModal(props) {
  var isOpen = props.isOpen
  var onClose = props.onClose
  var onSave = props.onSave
  var role = props.role
  var isEdit = !!role
  var isSuperAdmin = role && role.isLocked === true

  var formState = useState({ name: '', description: '', type: 'System', status: 'Active', permissions: 'all', customPerms: {} })
  var form = formState[0]; var setForm = formState[1]
  var errorsState = useState({})
  var errors = errorsState[0]; var setErrors = errorsState[1]
  var _mgrSt = useState(false); var showPermMgr = _mgrSt[0]; var setShowPermMgr = _mgrSt[1]
  var _verSt = useState(0); var permVersion = _verSt[0]; var setPermVersion = _verSt[1]

  useEffect(function() {
    if (role) {
      setForm({ name: role.name || '', description: role.description || '', type: role.type || 'System', status: role.status || 'Active', permissions: role.permissions === 'all' ? 'all' : 'custom', customPerms: permsToNested(role.permissions) })
    } else {
      setForm({ name: '', description: '', type: 'System', status: 'Active', permissions: 'all', customPerms: {} })
    }
    setErrors({}); setShowPermMgr(false); setPermVersion(0)
  }, [role, isOpen])

  useEffect(function() {
    if (!isEdit) { setForm(function(prev) { return Object.assign({}, prev, { customPerms: {}, permissions: 'all' }) }) }
  }, [form.type, isEdit])

  var filteredGroups = useMemo(function() { return getPermsByType(form.type) }, [form.type, permVersion])
  var filteredTotal = useMemo(function() { return filteredGroups.reduce(function(s, g) { return s + g.perms.length }, 0) }, [filteredGroups])
  var customCount = useMemo(function() { return nestedToPerms(form.customPerms).length }, [form.customPerms, permVersion])

  var togglePerm = function(groupKey, permLabel) {
    setForm(function(prev) {
      var cp = Object.assign({}, prev.customPerms)
      if (!cp[groupKey]) cp[groupKey] = {}
      cp[groupKey] = Object.assign({}, cp[groupKey])
      cp[groupKey][permLabel] = !cp[groupKey][permLabel]
      return Object.assign({}, prev, { customPerms: cp })
    })
  }
  var toggleGroupAll = function(group) {
    setForm(function(prev) {
      var cp = Object.assign({}, prev.customPerms)
      var current = cp[group.key] || {}
      var allOn = group.perms.every(function(p) { return current[p] })
      if (allOn) { delete cp[group.key] } else { cp[group.key] = {}; group.perms.forEach(function(p) { cp[group.key][p] = true }) }
      return Object.assign({}, prev, { customPerms: cp })
    })
  }
  var toggleFullAccess = function() {
    setForm(function(prev) { return Object.assign({}, prev, { permissions: prev.permissions === 'all' ? 'custom' : 'all' }) })
  }
  var handlePermChange = function() { setPermVersion(function(v) { return v + 1 }) }

  var validate = function() {
    var e = {}
    if (!form.name.trim()) e.name = 'Role name is required'
    if (form.permissions === 'custom' && customCount === 0) e.perms = 'Select at least one permission'
    setErrors(e); return Object.keys(e).length === 0
  }
  var handleSubmit = function(e) {
    e.preventDefault()
    if (!validate()) return
    var finalPerms
    if (form.permissions === 'all') { finalPerms = isSuperAdmin ? 'all' : getFullPermKeysForType(form.type) }
    else { finalPerms = nestedToPerms(form.customPerms) }
    onSave({ name: form.name.trim(), description: form.description.trim(), type: form.type, status: form.status, permissions: finalPerms })
  }

  if (!isOpen) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30" style={{ animation: 'pageIn 0.3s ease-out' }}>
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">{isEdit ? 'Edit Role' : 'Add New Role'}</h2>
              <p className="text-[12px] font-medium text-slate-400 mt-0.5">{isEdit ? 'Update role details and permissions' : 'Create a new role with module permissions'}</p>
            </div>
          </div>
          <button type="button" onClick={handleSubmit} className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-[13px] font-bold rounded-xl hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/10 active:scale-[0.98] transition-all duration-200">
            <Save className="w-4 h-4" strokeWidth={2.5} />
            {isEdit ? 'Update Role' : 'Create Role'}
          </button>
        </div>
      </div>

<form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 py-6 space-y-5">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div>
            <label className={labelCls}>Role Name <span className="text-rose-400">*</span></label>
            <input type="text" value={form.name} onChange={function(e) { setForm(Object.assign({}, form, { name: e.target.value })) }} placeholder="e.g. Donation Manager" disabled={isSuperAdmin}
              className={inputCls + (errors.name ? ' !border-rose-300 !focus:border-rose-500' : '') + (isSuperAdmin ? ' opacity-60 cursor-not-allowed bg-slate-50' : '')} />
            {errors.name && <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={function(e) { setForm(Object.assign({}, form, { description: e.target.value })) }} placeholder="Brief description of this role…" rows={2} className={inputCls + ' resize-none'} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div>
            <label className={labelCls}>Module Type</label>
            <p className="text-[11px] text-slate-400 font-medium mb-3 -mt-1">Selecting a type filters relevant permissions below</p>
            <div className="flex items-center gap-3 flex-wrap">
              {TYPE_OPTIONS.map(function(t) {
                var clr = TYPE_CLR[t.value]; var active = form.type === t.value; var Icon = t.icon
                var disabled = isSuperAdmin && t.value !== form.type
                return (
                  <button key={t.value} type="button" onClick={function() { if (!disabled) setForm(Object.assign({}, form, { type: t.value })) }} disabled={disabled}
                    className={'flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all border ' + (active ? clr.active : clr.bg + ' ' + clr.icon + ' ' + clr.border + ' hover:shadow-sm') + (disabled ? ' opacity-40 cursor-not-allowed' : ' cursor-pointer')}>
                    <Icon className="w-4 h-4" strokeWidth={2} />{t.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <div className="flex items-center gap-3">
              {['Active', 'Inactive'].map(function(s) {
                return (
                  <button key={s} type="button" onClick={function() { setForm(Object.assign({}, form, { status: s })) }}
                    className={'px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all border ' + (form.status === s ? (s === 'Active' ? 'bg-teal-600 text-white border-transparent shadow-sm' : 'bg-slate-700 text-white border-transparent shadow-sm') : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 cursor-pointer')}>
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <label className={labelCls + ' mb-0'}>Permissions</label>
              {form.permissions === 'custom' && !showPermMgr && <p className="text-[11px] text-slate-400 font-medium mt-0.5">{customCount} permission{customCount !== 1 ? 's' : ''} selected</p>}
            </div>
            <div className="flex items-center gap-2">
              {['Active', 'Inactive'].map(function(s) {
                return (
                  <button key={s} type="button" onClick={function() { setForm(Object.assign({}, form, { status: s })) }}
                    className={'px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all border ' + (form.status === s ? (s === 'Active' ? 'bg-teal-600 text-white border-transparent shadow-sm' : 'bg-slate-700 text-white border-transparent shadow-sm') : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 cursor-pointer')}>
                    {s}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-2">
              {!isSuperAdmin && !showPermMgr && (
                <button type="button" onClick={toggleFullAccess} className={'text-[12px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ' + (form.permissions === 'all' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}>
                  {form.permissions === 'all' ? '✓ Full Access' : 'Set Full Access'}
                </button>
              )}
              {!isSuperAdmin && (
                <button type="button" onClick={function() { setShowPermMgr(!showPermMgr) }} className={'text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer border ' + (showPermMgr ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100')}>
                  {showPermMgr ? '← Back to Assign' : '⚙ Manage Permissions'}
                </button>
              )}
            </div>
          </div>

          {isSuperAdmin && (
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 text-center">
              <Lock className="w-6 h-6 text-teal-600 mx-auto mb-2" />
              <p className="text-[13px] font-bold text-teal-700">Super Admin has unrestricted access</p>
              <p className="text-[11px] text-teal-600/70 font-medium mt-0.5">{getTotalPerms()} permissions across {PERM_GROUPS.length} modules</p>
            </div>
          )}

          {errors.perms && !showPermMgr && <p className="text-[11px] text-rose-500 font-medium mb-2">{errors.perms}</p>}

          {showPermMgr && !isSuperAdmin && (
            <div className="max-h-[400px] overflow-y-auto pr-1">
              <PermissionManager filterType={form.type} onChange={handlePermChange} />
            </div>
          )}

          {form.permissions !== 'all' && !isSuperAdmin && !showPermMgr && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredGroups.map(function(group) {
                return <PermGroupCard key={group.key} group={group} customPerms={form.customPerms} onTogglePerm={togglePerm} onToggleGroupAll={toggleGroupAll} />
              })}
            </div>
          )}

          {!isSuperAdmin && form.permissions === 'all' && !showPermMgr && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-center">
              <ShieldCheck className="w-6 h-6 text-teal-500 mx-auto mb-2" />
              <p className="text-[13px] font-bold text-slate-700">Full access to all <span className="text-teal-600">{form.type}</span> modules</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{filteredTotal} permissions across {filteredGroups.length} modules</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-50">
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" className="px-5 py-2.5 bg-teal-600 text-white text-[13px] font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-sm">{isEdit ? 'Update Role' : 'Create Role'}</button>
        </div>
      </form>

      <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'); * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; } @keyframes pageIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } } @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }" }} />
    </div>
  )
}
