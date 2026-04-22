import { useMemo, useState } from 'react'
import { User, Mail, Phone, Shield } from 'lucide-react'
import EmptyState from '../../components/ui/EmptyState'
import CommonCard from '../../components/ui/CommonCard'
import CommonPageLayout from '../../components/ui/CommonPageLayout'

const DATA = [
  { id: 1, title: 'Profile Identity', subtitle: 'Name, designation, and sangh assignment', value: 'Naman Doshi - Super Admin', status: 'Active' },
  { id: 2, title: 'Contact Details', subtitle: 'Email and phone preferences', value: 'naman@jainsangh.com - +91 9876543210', status: 'Active' },
  { id: 3, title: 'Security Summary', subtitle: 'Password, device trust, and recovery checks', value: '2 checkpoints pending', status: 'Inactive' },
]

export default function Profile() {
  const [search, setSearch] = useState('')
  const filtered = useMemo(function() {
    return DATA.filter(function(item) {
      const query = search.toLowerCase()
      return !query || [item.title, item.subtitle, item.value].some(function(value) { return String(value || '').toLowerCase().includes(query) })
    })
  }, [search])

  return (
    <CommonPageLayout
      title="Profile"
      subtitle="Review and manage profile information for the current administrator."
      stats={[
        { title: 'Profile Sections', value: DATA.length, icon: User, color: 'teal' },
        { title: 'Verified Contacts', value: 2, icon: Mail, color: 'emerald' },
        { title: 'Mobile Numbers', value: 1, icon: Phone, color: 'sky' },
        { title: 'Security Checks', value: 3, icon: Shield, color: 'amber' },
      ]}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search profile section, value, or security note..."
      isEmpty={!filtered.length}
      emptyState={<EmptyState message="No profile sections found" description="Profile settings will appear here once configured." icon={User} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(function(item, index) {
          return (
            <CommonCard key={item.id} icon={User} iconWrapperClassName="bg-teal-50 border-teal-100" iconClassName="text-teal-600" accentClassName="bg-teal-500" title={item.title} subtitle={item.subtitle} status={item.status} meta={[{ value: item.value }]} footerLeft={<span className="text-[11px] font-bold text-slate-400">Profile Control</span>} index={index} />
          )
        })}
      </div>
    </CommonPageLayout>
  )
}
