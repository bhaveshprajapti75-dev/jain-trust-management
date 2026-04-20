import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Mail, Phone, MapPin, CalendarDays, ShieldCheck, FileText, Clock } from 'lucide-react'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/common/Button'
import UserStatusToggle from '../../components/users/UserStatusToggle'
import UserPermissions from '../../components/users/UserPermissions'
import UserDocuments from '../../components/users/UserDocuments'
import UserActivity from '../../components/users/UserActivity'
import { getRole, getRoleName, getUserDocs, getUserActivities, getDocCount } from './userData'
import { INITIAL_USERS, INITIAL_USER_DOCS, INITIAL_ACTIVITIES } from './userData'
import { getCount } from '../RolesAndPermissions/RoleData'
import { INITIAL_TRUSTS, INITIAL_SANGHS, INITIAL_DEPARTMENTS, getTrustName, getDeptName } from '../organization/orgData'

var TABS = ['Details', 'Permissions', 'Documents', 'Activity', 'Status History']

export default function UserDetails() {
  var params = useParams(); var userId = parseInt(params.id)
  var navigate = useNavigate()

  var usersState = useState(function() { try { var s = localStorage.getItem('users_full'); return s ? JSON.parse(s) : INITIAL_USERS } catch(e) { return INITIAL_USERS } })
  var users = usersState[0]; var setUsers = usersState[1]
  var docsState = useState(function() { try { var s = localStorage.getItem('user_docs'); return s ? JSON.parse(s) : INITIAL_USER_DOCS } catch(e) { return INITIAL_USER_DOCS } })
  var docs = docsState[0]; var setDocs = docsState[1]
  var actsState = useState(function() { try { var s = localStorage.getItem('user_activities'); return s ? JSON.parse(s) : INITIAL_ACTIVITIES } catch(e) { return INITIAL_ACTIVITIES } })
  var acts = actsState[0]; var setActs = actsState[1]
  var trusts = useState(function() { try { var s = localStorage.getItem('org_trusts'); return s ? JSON.parse(s) : INITIAL_TRUSTS } catch(e) { return INITIAL_TRUSTS } })[0]
  var sanghs = useState(function() { try { var s = localStorage.getItem('org_sanghs'); return s ? JSON.parse(s) : INITIAL_SANGHS } catch(e) { return INITIAL_SANGHS } })[0]
  var depts = useState(function() { try { var s = localStorage.getItem('org_departments'); return s ? JSON.parse(s) : INITIAL_DEPARTMENTS } catch(e) { return INITIAL_DEPARTMENTS } })[0]

  var tabState = useState('Details'); var activeTab = tabState[0]; var setActiveTab = tabState[1]

  useEffect(function() { localStorage.setItem('users_full', JSON.stringify(users)) }, [users])
  useEffect(function() { localStorage.setItem('user_docs', JSON.stringify(docs)) }, [docs])
  useEffect(function() { localStorage.setItem('user_activities', JSON.stringify(acts)) }, [acts])

  var user = useMemo(function() { return users.find(function(u) { return u.id === userId }) }, [users, userId])
  var role = useMemo(function() { return getRole(user?.roleId) }, [user])
  var trust = useMemo(function() { return trusts.find(function(t) { return t.id === user?.trustId }) }, [user, trusts])
  var sangh = useMemo(function() { return sanghs.find(function(s) { return s.id === user?.sanghId }) }, [user, sanghs])
  var dept = useMemo(function() { return depts.find(function(d) { return d.id === user?.departmentId }) }, [user, depts])
  var userDocs = useMemo(function() { return getUserDocs(userId, docs) }, [userId, docs])
  var userActs = useMemo(function() { return getUserActivities(userId, acts) }, [userId, acts])
  var statusActs = useMemo(function() { return userActs.filter(function(a) { return a.action === 'status_change' }) }, [userActs])

  if (!user) return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 flex items-center justify-center min-h-[calc(100vh-3.5rem)] bg-[#f8fafc]">
      <div className="text-center"><p className="text-[14px] font-bold text-slate-600 mb-3">User not found</p><Button variant="secondary" onClick={function() { navigate('/users') }}>Go Back</Button></div>
    </div>
  )

  var TYPE_CLR = { System: { text: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' }, Sangh: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' }, Trust: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' } }
  var s = TYPE_CLR[role?.type] || TYPE_CLR.System
  var initials = user.name.split(' ').map(function(n) { return n[0] }).join('').toUpperCase().slice(0, 2)

  var handleStatusChange = function(newStatus) {
    if (newStatus === user.status) return
    setUsers(function(prev) { return prev.map(function(u) { return u.id === userId ? Object.assign({}, u, { status: newStatus }) : u }) })
    setActs(function(prev) { return prev.concat([{ id: Date.now(), userId: userId, action: 'status_change', description: 'Status changed from ' + user.status + ' to ' + newStatus, doneBy: 'Admin', date: new Date().toISOString().slice(0, 16).replace('T', ' ') }]) })
  }

  var handleDocUpload = function(docData) {
    var newDoc = { id: Date.now(), userId: userId, type: docData.type, fileName: docData.type.toLowerCase().replace(/\s/g, '_') + '.pdf', status: 'Pending', uploadedDate: new Date().toISOString().split('T')[0], uploadedBy: 'Admin', notes: docData.notes || '' }
    setDocs(function(prev) { return prev.concat([newDoc]) })
    setActs(function(prev) { return prev.concat([{ id: Date.now() + 1, userId: userId, action: 'doc_upload', description: docData.type + ' document uploaded', doneBy: 'Admin', date: new Date().toISOString().slice(0, 16).replace('T', ' ') }]) })
  }

  var handleDocDelete = function(docId) {
    setDocs(function(prev) { return prev.filter(function(d) { return d.id !== docId }) })
  }

  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 via-white to-teal-50/30" style={{ animation: 'pageIn 0.3s ease-out' }}>
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={function() { navigate('/users') }} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"><ArrowLeft className="w-4 h-4" /></button>
            <div className="flex items-center gap-3">
              <div className={'w-12 h-12 rounded-xl ' + s.bg + ' flex items-center justify-center shrink-0 border ' + s.border}><span className={'text-[14px] font-black ' + s.text}>{initials}</span></div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">{user.name}</h2>
                  <StatusBadge status={user.status} />
                  <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">{role ? role.name : '-'}</span>
                </div>
                <p className="text-[12px] text-slate-400 mt-0.5">{getRoleName(user.roleId)} • {trust?.name || '-'}</p>
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm" icon={Pencil} onClick={function() { navigate('/users/edit/' + user.id) }}>Edit</Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">
        {/* Profile Section */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-xl p-3.5"><p className="text-[10px] font-semibold text-slate-400 mb-0.5">Email</p><p className="text-[13px] font-bold text-slate-700 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" />{user.email || '-'}</p></div>
            <div className="bg-slate-50 rounded-xl p-3.5"><p className="text-[10px] font-semibold text-slate-400 mb-0.5">Phone</p><p className="text-[13px] font-bold text-slate-700 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" />{user.phone}</p></div>
            <div className="bg-slate-50 rounded-xl p-3.5"><p className="text-[10px] font-semibold text-slate-400 mb-0.5">Joined</p><p className="text-[13px] font-bold text-slate-700 flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5 text-slate-400" />{user.joined}</p></div>
            <div className="bg-slate-50 rounded-xl p-3.5"><p className="text-[10px] font-semibold text-slate-400 mb-0.5">Last Login</p><p className="text-[13px] font-bold text-slate-700 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-400" />{user.lastLogin || 'Never'}</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-slate-50 rounded-xl p-3.5"><p className="text-[10px] font-semibold text-slate-400 mb-0.5">Sangh</p><p className="text-[13px] font-bold text-slate-700">{sangh?.name || '-'}</p></div>
            <div className="bg-slate-50 rounded-xl p-3.5"><p className="text-[10px] font-semibold text-slate-400 mb-0.5">Department</p><p className="text-[13px] font-bold text-slate-700">{dept?.name || '-'}</p></div>
            <div className="bg-slate-50 rounded-xl p-3.5"><p className="text-[10px] font-semibold text-slate-400 mb-0.5">Notes</p><p className="text-[13px] font-bold text-slate-700">{user.notes || '-'}</p></div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2"><span className="text-[12px] font-bold text-slate-700">Status:</span><UserStatusToggle status={user.status} onChange={handleStatusChange} /></div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />{role ? getCount(role) : 0} Permissions</span>
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{getDocCount(userId, docs)} Documents</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex items-center gap-6">
            {TABS.map(function(tab) {
              return (
                <button key={tab} onClick={function() { setActiveTab(tab) }}
                  className={'pb-3 text-[13px] font-medium transition-colors border-b-2 -mb-px ' + (activeTab === tab ? 'border-teal-600 text-teal-700 font-bold' : 'border-transparent text-slate-400 hover:text-slate-600')}>
                  {tab}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'Details' && (
          <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
            <h3 className="text-[14px] font-bold text-slate-800 mb-3">Role Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><p className="text-[10px] text-slate-400 mb-0.5">Role</p><p className="text-[13px] font-bold text-slate-700">{role?.name || '-'}</p></div>
              <div><p className="text-[10px] text-slate-400 mb-0.5">Type</p><p className="text-[13px] font-bold text-slate-700">{role?.type || '-'}</p></div>
              <div><p className="text-[10px] text-slate-400 mb-0.5">Permission Type</p><p className="text-[13px] font-bold text-slate-700">{role?.permissions === 'all' ? 'Full Access' : 'Custom'}</p></div>
              <div><p className="text-[10px] text-slate-400 mb-0.5">Permissions Count</p><p className="text-[13px] font-bold text-teal-600">{role ? getCount(role) : 0}</p></div>
            </div>
            {user.notes && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg"><p className="text-[10px] font-bold text-amber-700 mb-0.5">Notes</p><p className="text-[12px] text-slate-700">{user.notes}</p></div>
            )}
          </div>
        )}

        {activeTab === 'Permissions' && (
          <UserPermissions role={role} extraPerms={user.permissions || []} />
        )}

        {activeTab === 'Documents' && (
          <UserDocuments documents={userDocs} onUpload={handleDocUpload} onDelete={handleDocDelete} />
        )}

        {activeTab === 'Activity' && (
          <UserActivity activities={userActs} />
        )}

        {activeTab === 'Status History' && (
          <UserActivity activities={statusActs} />
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'); * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; } @keyframes pageIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } } @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }" }} />
    </div>
  )
}
