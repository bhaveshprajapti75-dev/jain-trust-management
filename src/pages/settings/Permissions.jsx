import { useMemo, useState } from 'react'
import { Shield, Lock, Users } from 'lucide-react'
import EmptyState from '../../components/common/EmptyState'
import CommonCard from '../../components/common/CommonCard'
import CommonPageLayout from '../../components/common/CommonPageLayout'

const DATA = [
  { id: 1, title: 'Role Assignment Policy', subtitle: 'Trust Admin and Sangh Admin assignment checks', value: 'Scope locked to assigned unit', status: 'Active' },
  { id: 2, title: 'Delete Restrictions', subtitle: 'Managers cannot delete operational records', value: 'Enforced on sangh modules', status: 'Active' },
  { id: 3, title: 'View Rules', subtitle: 'Normal users remain view-only', value: 'Reports and master data visible only', status: 'Active' },
]

export default function Permissions() {
  const [search, setSearch] = useState('')
  const filtered = useMemo(function() {
    return DATA.filter(function(item) {
      const query = search.toLowerCase()
      return !query || [item.title, item.subtitle, item.value].some(function(value) { return String(value || '').toLowerCase().includes(query) })
    })
  }, [search])

  return (
    <CommonPageLayout
      title="Permissions"
      subtitle="Review permission policies applied across trust, sangh, and user levels."
      stats={[
        { title: 'Policies', value: DATA.length, icon: Shield, color: 'teal' },
        { title: 'Restricted Actions', value: 5, icon: Lock, color: 'emerald' },
        { title: 'Role Groups', value: 6, icon: Users, color: 'sky' },
        { title: 'Protected Modules', value: 10, icon: Shield, color: 'amber' },
      ]}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search permission title, rule, or value..."
      isEmpty={!filtered.length}
      emptyState={<EmptyState message="No permission policies found" description="Permission policies will appear here as they are configured." icon={Shield} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(function(item, index) {
          return (
            <CommonCard key={item.id} icon={Shield} iconWrapperClassName="bg-sky-50 border-sky-100" iconClassName="text-sky-600" accentClassName="bg-sky-500" title={item.title} subtitle={item.subtitle} status={item.status} meta={[{ value: item.value }]} footerLeft={<span className="text-[11px] font-bold text-slate-400">Permission Rule</span>} index={index} />
          )
        })}
      </div>
    </CommonPageLayout>
  )
}
