import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '../../components/common/Button'
import UserForm from '../../components/users/UserForm'
import { useState, useEffect } from 'react'
import { INITIAL_USERS, INITIAL_USER_DOCS, INITIAL_ACTIVITIES } from './userData'
import { INITIAL_TRUSTS, INITIAL_SANGHS, INITIAL_DEPARTMENTS } from '../organization/orgData'
import { INITIAL_ROLES } from '../RolesAndPermissions/RoleData'

export default function AddUser() {
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
  var roles = useState(function() { try { var s = localStorage.getItem('rp_roles'); return s ? JSON.parse(s) : INITIAL_ROLES } catch(e) { return INITIAL_ROLES } })[0]

  var handleSave = function(data) {
    var newId = Math.max.apply(null, [0].concat(users.map(function(u) { return u.id }))) + 1
    var newUser = Object.assign({}, data, { id: newId, joined: new Date().toISOString().split('T')[0], lastLogin: null })
    setUsers(function(prev) { return prev.concat([newUser]) })
    setActs(function(prev) { return prev.concat([{ id: Date.now(), userId: newId, action: 'created', description: 'User account created', doneBy: 'Admin', date: new Date().toISOString().slice(0, 16).replace('T', ' ') }]) })
    if (data.permissions && data.permissions.length > 0) {
      setActs(function(prev) { return prev.concat([{ id: Date.now() + 1, userId: newId, action: 'permission_change', description: 'Custom permissions assigned: ' + data.permissions.join(', '), doneBy: 'Admin', date: new Date().toISOString().slice(0, 16).replace('T', ' ') }]) })
    }
    navigate('/users')
  }

  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 via-white to-teal-50/30" style={{ animation: 'pageIn 0.3s ease-out' }}>
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={function() { navigate('/users') }} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"><ArrowLeft className="w-4 h-4" /></button>
          <div><h2 className="text-[18px] font-bold text-slate-800 tracking-tight">Add New User</h2><p className="text-[12px] text-slate-400 mt-0.5">Create a new user account with role assignment</p></div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <UserForm roles={roles} trusts={trusts} sanghs={sanghs} departments={depts} onSave={handleSave} onCancel={function() { navigate('/users') }} />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: "@keyframes pageIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }" }} />
    </div>
  )
}
