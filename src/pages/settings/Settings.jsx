import { useMemo, useState } from 'react'
import { Settings2, Shield, UserCog } from 'lucide-react'
import EmptyState from '../../components/common/EmptyState'
import CommonCard from '../../components/common/CommonCard'
import CommonPageLayout from '../../components/common/CommonPageLayout'

const DATA = [
  { id: 1, title: 'Organization Defaults', subtitle: 'Trust naming, receipt prefixes, and document numbering', status: 'Active' },
  { id: 2, title: 'Access Policies', subtitle: 'Role enforcement, view limits, and audit reminders', status: 'Active' },
  { id: 3, title: 'Module Preferences', subtitle: 'Sidebar visibility, report defaults, and dashboard toggles', status: 'Inactive' },
]

export default function Settings() {
  const [search, setSearch] = useState('')
  const filtered = useMemo(function() {
    return DATA.filter(function(item) {
      const query = search.toLowerCase()
      return !query || [item.title, item.subtitle].some(function(value) { return String(value || '').toLowerCase().includes(query) })
    })
  }, [search])

  return (
    <CommonPageLayout
      title="Settings"
      subtitle="Manage organization-wide settings for the trust management system."
      stats={[
        { title: 'Setting Blocks', value: DATA.length, icon: Settings2, color: 'teal' },
        { title: 'Active Policies', value: DATA.filter(function(item) { return item.status === 'Active' }).length, icon: Shield, color: 'emerald' },
        { title: 'Profile Controls', value: 4, icon: UserCog, color: 'sky' },
        { title: 'Permission Policies', value: 6, icon: Shield, color: 'amber' },
      ]}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search setting title or description..."
      isEmpty={!filtered.length}
      emptyState={<EmptyState message="No settings sections found" description="Add a settings group to manage the platform defaults." icon={Settings2} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(function(item, index) {
          return (
            <CommonCard key={item.id} icon={Settings2} iconWrapperClassName="bg-slate-50 border-slate-200" iconClassName="text-slate-600" accentClassName="bg-teal-500" title={item.title} subtitle={item.subtitle} status={item.status} footerLeft={<span className="text-[11px] font-bold text-slate-400">Settings Group</span>} index={index} />
          )
        })}
      </div>
    </CommonPageLayout>
  )
}
