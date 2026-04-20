import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Users, ShieldCheck, Building2, Plus } from 'lucide-react'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import CommonPageLayout from '../../components/ui/CommonPageLayout'
import Table from '../../components/ui/Table'
import { Pencil } from 'lucide-react'
import { INITIAL_USERS, INITIAL_USER_DOCS, getDocCount } from '../users/userData'
import { INITIAL_ROLES } from '../RolesAndPermissions/RoleData'

export default function CommitteeMembers() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [users] = useState(function() {
    try {
      const stored = localStorage.getItem('users_full')
      return stored ? JSON.parse(stored) : INITIAL_USERS
    } catch {
      return INITIAL_USERS
    }
  })
  const [docs] = useState(function() {
    try {
      const stored = localStorage.getItem('user_docs')
      return stored ? JSON.parse(stored) : INITIAL_USER_DOCS
    } catch {
      return INITIAL_USER_DOCS
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

  const committeeMembers = useMemo(function() {
    return users.filter(function(user) {
      const query = search.toLowerCase()
      const isCommittee = user.committee === true
      const matchesSearch = !query || [user.name, user.committeeRole, user.notes].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
      return isCommittee && matchesSearch
    })
  }, [search, users])

  const stats = useMemo(function() {
    const active = committeeMembers.filter(function(user) { return user.status === 'Active' }).length
    const rolesCovered = new Set(committeeMembers.map(function(user) { return user.roleId })).size
    const sanghsCovered = new Set(committeeMembers.map(function(user) { return user.sanghId })).size
    return [
      { title: 'Committee Members', value: committeeMembers.length, icon: Users, color: 'teal' },
      { title: 'Active Members', value: active, icon: ShieldCheck, color: 'emerald' },
      { title: 'Role Levels', value: rolesCovered, icon: ShieldCheck, color: 'sky' },
      { title: 'Sanghs Covered', value: sanghsCovered, icon: Building2, color: 'amber' },
    ]
  }, [committeeMembers])

  return (
      <CommonPageLayout
        title="Committee Members"
        subtitle="View committee members across trust and sangh governance bodies."
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
      action={<Button icon={Plus} onClick={function() { navigate('/users') }}>Add Member</Button>}
      stats={stats}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search committee name, role, or notes..."
      isEmpty={!committeeMembers.length}
      emptyState={<EmptyState message="No committee members found" description="Assign committee members from the users list to see them here." icon={Users} />}
      contentClassName="p-0 border-none bg-transparent shadow-none"
    >
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mt-1 mx-1 mb-1">
        <Table
          columns={[
            {
              key: 'srNo',
              label: 'Sr. No.',
              align: 'center',
              render: (_, __, idx) => <span className="text-[13.5px] font-medium text-slate-500">{idx + 1}</span>
            },
            {
              key: 'userInfo',
              label: 'Member Info',
              render: (_, user) => (
                <div className="flex items-center gap-3">
                  <img src={user.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                  <div>
                    <p className="text-[13.5px] font-bold text-slate-800 group-hover:text-emerald-700 transition-colors uppercase decoration-emerald-200 underline-offset-4 hover:decoration-emerald-500 hover:underline">{user.name}</p>
                    <p className="text-[11.5px] font-medium text-slate-500 lowercase">{user.email || user.phone}</p>
                  </div>
                </div>
              )
            },
            {
              key: 'role',
              label: 'Role & Permissions',
              render: (_, user) => {
                const role = roles.find(item => item.id === user.roleId)
                return (
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-[12.5px] font-bold text-slate-700">{role?.name || '-'}</span>
                    <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">{role?.type || 'No Role'}</span>
                  </div>
                )
              }
            },
            {
              key: 'committeeRole',
              label: 'Committee Role',
              render: (_, user) => <span className="text-[12.5px] font-medium text-slate-600">{user.committeeRole || 'Member'}</span>
            },
            {
              key: 'status',
              label: 'Status',
              align: 'center',
              render: (_, user) => {
                const status = user.status || 'Active'
                return (
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {status}
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
                    onClick={(e) => { e.stopPropagation(); navigate('/users/' + user.id); }}
                  >
                    <Pencil size={15} strokeWidth={2} />
                  </button>
                </div>
              )
            }
          ]}
          data={committeeMembers}
          skipCard={true}
          onRowClick={(user) => navigate('/users/' + user.id)}
        />
      </div>
    </CommonPageLayout>
  )
}

