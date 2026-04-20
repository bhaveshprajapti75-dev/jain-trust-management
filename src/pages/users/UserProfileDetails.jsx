import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, CalendarDays, Clock3, FileText, Mail, Pencil, Phone, ShieldCheck, Users } from 'lucide-react'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import UserActivity from '../../components/users/UserActivity'
import UserDocuments from '../../components/users/UserDocuments'
import UserPermissions from '../../components/users/UserPermissions'
import UserProfileForm from '../../components/users/UserProfileForm'
import UserStatusToggle from '../../components/users/UserStatusToggle'
import { INITIAL_ACTIVITIES, INITIAL_USER_DOCS, INITIAL_USERS, getDocCount, getRole, getUserActivities, getUserDocs } from './userData'
import { getCount, INITIAL_ROLES } from '../RolesAndPermissions/RoleData'
import { INITIAL_DEPARTMENTS, INITIAL_SANGHS, INITIAL_TRUSTS } from '../organization/orgData'

const TABS = ['Overview', 'Permissions', 'Documents', 'Activity', 'Status History']

function readStored(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export default function UserProfileDetails() {
  const navigate = useNavigate()
  const params = useParams()
  const userId = Number(params.id)

  const [users, setUsers] = useState(function() { return readStored('users_full', INITIAL_USERS) })
  const [docs, setDocs] = useState(function() { return readStored('user_docs', INITIAL_USER_DOCS) })
  const [activities, setActivities] = useState(function() { return readStored('user_activities', INITIAL_ACTIVITIES) })
  const [roles] = useState(function() { return readStored('rp_roles', INITIAL_ROLES) })
  const [trusts] = useState(function() { return readStored('org_trusts', INITIAL_TRUSTS) })
  const [sanghs] = useState(function() { return readStored('org_sanghs', INITIAL_SANGHS) })
  const [departments] = useState(function() { return readStored('org_departments', INITIAL_DEPARTMENTS) })
  const [activeTab, setActiveTab] = useState('Overview')
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(function() {
    localStorage.setItem('users_full', JSON.stringify(users))
  }, [users])

  useEffect(function() {
    localStorage.setItem('user_docs', JSON.stringify(docs))
  }, [docs])

  useEffect(function() {
    localStorage.setItem('user_activities', JSON.stringify(activities))
  }, [activities])

  const user = useMemo(function() {
    return users.find(function(item) { return item.id === userId })
  }, [userId, users])

  const role = useMemo(function() {
    return user ? roles.find(function(item) { return item.id === user.roleId }) || getRole(user.roleId) : null
  }, [roles, user])

  const trust = useMemo(function() {
    return trusts.find(function(item) { return item.id === user?.trustId })
  }, [trusts, user])

  const sangh = useMemo(function() {
    return sanghs.find(function(item) { return item.id === user?.sanghId })
  }, [sanghs, user])

  const department = useMemo(function() {
    return departments.find(function(item) { return item.id === user?.departmentId })
  }, [departments, user])

  const userDocs = useMemo(function() {
    return getUserDocs(userId, docs)
  }, [docs, userId])

  const userActivities = useMemo(function() {
    return getUserActivities(userId, activities)
  }, [activities, userId])

  const statusHistory = useMemo(function() {
    return userActivities.filter(function(item) { return item.action === 'status_change' })
  }, [userActivities])

  function createTimestamp() {
    return new Date().toISOString().slice(0, 16).replace('T', ' ')
  }

  function handleSave(updatedUser) {
    setUsers(function(current) {
      return current.map(function(item) {
        return item.id === userId ? { ...item, ...updatedUser } : item
      })
    })
    setActivities(function(current) {
      return current.concat([{
        id: Date.now(),
        userId,
        action: 'updated',
        description: 'User profile details were updated from the detail page.',
        doneBy: 'Admin',
        date: createTimestamp(),
      }])
    })
    setShowEditModal(false)
  }

  function handleStatusChange(nextStatus) {
    if (!user || nextStatus === user.status) return

    setUsers(function(current) {
      return current.map(function(item) {
        return item.id === userId ? { ...item, status: nextStatus } : item
      })
    })

    setActivities(function(current) {
      return current.concat([{
        id: Date.now(),
        userId,
        action: 'status_change',
        description: 'Status changed from ' + user.status + ' to ' + nextStatus,
        doneBy: 'Admin',
        date: createTimestamp(),
      }])
    })
  }

  function handleDocUpload(docData) {
    const createdDate = new Date().toISOString().split('T')[0]
    setDocs(function(current) {
      return current.concat([{
        id: Date.now(),
        userId,
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
        userId,
        action: 'updated',
        description: docData.type + ' document was added to the profile.',
        doneBy: 'Admin',
        date: createTimestamp(),
      }])
    })
  }

  function handleDocDelete(docId) {
    setDocs(function(current) {
      return current.filter(function(item) { return item.id !== docId })
    })
  }

  if (!user) {
    return (
      <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-[#f8fafc] px-5 lg:px-7">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <p className="text-[15px] font-semibold text-slate-700">User not found</p>
          <p className="mt-1 text-[13px] text-slate-400">The requested profile is not available in the current list.</p>
          <Button variant="secondary" className="mt-5" onClick={function() { navigate('/users') }}>Go Back</Button>
        </div>
      </div>
    )
  }

  const summaryItems = [
    { label: 'Email Address', value: user.email || '-', icon: Mail },
    { label: 'Phone Number', value: user.phone || '-', icon: Phone },
    { label: 'Joined On', value: user.joined || '-', icon: CalendarDays },
    { label: 'Last Login', value: user.lastLogin || 'Never', icon: Clock3 },
  ]

  const stats = [
    { label: 'Role', value: role?.name || '-', icon: ShieldCheck },
    { label: 'Trust', value: trust?.name || '-', icon: Building2 },
    { label: 'Sangh', value: sangh?.name || '-', icon: Users },
    { label: 'Documents', value: String(getDocCount(userId, docs)), icon: FileText },
  ]

  const initials = user.name.split(' ').map(function(part) { return part[0] }).join('').toUpperCase().slice(0, 2)

  return (
    <>
      <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 min-h-[calc(100vh-3.5rem)] bg-[#f8fafc] px-5 lg:px-7 pt-5 pb-8">
        <div className="max-w-[1480px] space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={function() { navigate('/users') }} className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors flex items-center justify-center">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-600">User Profile</p>
                <h1 className="text-[24px] font-bold tracking-tight text-slate-900">{user.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" icon={ArrowLeft} onClick={function() { navigate('/users') }}>Back to Users</Button>
              <Button icon={Pencil} onClick={function() { setShowEditModal(true) }}>Edit User</Button>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col xl:flex-row xl:items-start gap-6">
              <div className="flex items-start gap-4 xl:min-w-[360px]">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 flex items-center justify-center text-[18px] font-bold text-teal-700 shadow-sm">
                  {initials}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[20px] font-bold text-slate-900">{user.name}</h2>
                    <StatusBadge status={user.status} />
                  </div>
                  <p className="text-[13px] text-slate-500">{role?.name || 'No role assigned'}</p>
                  <p className="text-[13px] text-slate-400 max-w-xl">{user.notes || 'No internal notes added for this user profile yet.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 flex-1">
                {stats.map(function(item) {
                  return (
                    <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <item.icon className="w-4 h-4" />
                        <span className="text-[11px] font-semibold uppercase tracking-wide">{item.label}</span>
                      </div>
                      <p className="mt-2 text-[14px] font-semibold text-slate-800">{item.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mt-6">
              {summaryItems.map(function(item) {
                return (
                  <div key={item.label} className="rounded-2xl border border-slate-100 bg-white px-4 py-3.5">
                    <div className="flex items-center gap-2 text-slate-400">
                      <item.icon className="w-4 h-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-wide">{item.label}</span>
                    </div>
                    <p className="mt-2 text-[13px] font-semibold text-slate-700 break-words">{item.value}</p>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Department</p>
                <p className="mt-2 text-[13px] font-semibold text-slate-700">{department?.name || '-'}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Committee Role</p>
                <p className="mt-2 text-[13px] font-semibold text-slate-700">{user.committee ? user.committeeRole || 'Committee Member' : 'Not assigned'}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Permission Count</p>
                <p className="mt-2 text-[13px] font-semibold text-slate-700">{role ? getCount(role) : 0} permissions</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4">
              <div>
                <p className="text-[13px] font-semibold text-slate-700">Profile Status</p>
                <p className="text-[12px] text-slate-400 mt-0.5">Update this user state without leaving the detail page.</p>
              </div>
              <UserStatusToggle status={user.status} onChange={handleStatusChange} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm flex flex-wrap gap-2">
            {TABS.map(function(tab) {
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={function() { setActiveTab(tab) }}
                  className={`px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
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

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            {activeTab === 'Overview' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                  <h3 className="text-[15px] font-semibold text-slate-800">Assignment Summary</h3>
                  <div className="mt-4 space-y-3 text-[13px] text-slate-600">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-400">Role</span>
                      <span className="font-semibold text-slate-800">{role?.name || '-'}</span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-400">Trust</span>
                      <span className="font-semibold text-slate-800 text-right">{trust?.name || '-'}</span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-400">Sangh</span>
                      <span className="font-semibold text-slate-800 text-right">{sangh?.name || '-'}</span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-400">Department</span>
                      <span className="font-semibold text-slate-800">{department?.name || '-'}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                  <h3 className="text-[15px] font-semibold text-slate-800">Operational Notes</h3>
                  <p className="mt-4 text-[13px] leading-6 text-slate-600">
                    {user.notes || 'No internal notes are attached to this user yet. Add notes while editing the profile to help the team track responsibilities and follow-ups.'}
                  </p>
                </div>
              </div>
            ) : null}

            {activeTab === 'Permissions' ? <UserPermissions role={role} extraPerms={user.permissions || []} /> : null}
            {activeTab === 'Documents' ? <UserDocuments documents={userDocs} onUpload={handleDocUpload} onDelete={handleDocDelete} /> : null}
            {activeTab === 'Activity' ? <UserActivity activities={userActivities} /> : null}
            {activeTab === 'Status History' ? <UserActivity activities={statusHistory} /> : null}
          </div>
        </div>
      </div>

      <Modal isOpen={showEditModal} onClose={function() { setShowEditModal(false) }} title="Edit User" size="xl">
        <UserProfileForm user={user} roles={roles} trusts={trusts} sanghs={sanghs} departments={departments} onSave={handleSave} onCancel={function() { setShowEditModal(false) }} />
      </Modal>
    </>
  )
}
