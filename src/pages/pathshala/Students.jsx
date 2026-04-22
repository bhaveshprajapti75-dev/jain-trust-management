import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BookOpen, GraduationCap, CalendarCheck2, Plus } from 'lucide-react'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import CommonCard from '../../components/ui/CommonCard'
import CommonPageLayout from '../../components/ui/CommonPageLayout'

const DATA = [
  { id: 1, name: 'Aarav Shah', standard: 'Bal Varg 2', subject: 'Navkar Mantra', guardian: 'Rajesh Shah', attendance: 92, status: 'Active' },
  { id: 2, name: 'Kavya Mehta', standard: 'Junior A', subject: 'Jain Stories', guardian: 'Meena Mehta', attendance: 88, status: 'Active' },
  { id: 3, name: 'Krish Doshi', standard: 'Senior', subject: 'Tattvartha Sutra', guardian: 'Hiral Doshi', attendance: 81, status: 'Inactive' },
]

export default function Students() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')

  const filtered = useMemo(function() {
    return DATA.filter(function(item) {
      const query = search.toLowerCase()
      return !query || [item.name, item.standard, item.subject, item.guardian].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
    })
  }, [search])

  const stats = useMemo(function() {
    const active = DATA.filter(function(item) { return item.status === 'Active' }).length
    const batches = new Set(DATA.map(function(item) { return item.standard })).size
    const avgAttendance = Math.round(DATA.reduce(function(sum, item) { return sum + item.attendance }, 0) / DATA.length)
    return [
      { title: 'Students', value: DATA.length, icon: GraduationCap, color: 'teal' },
      { title: 'Active Students', value: active, icon: BookOpen, color: 'emerald' },
      { title: 'Batches', value: batches, icon: CalendarCheck2, color: 'sky' },
      { title: 'Avg Attendance', value: avgAttendance + '%', icon: CalendarCheck2, color: 'amber' },
    ]
  }, [])

  return (
    <CommonPageLayout
      title="Students"
      subtitle="Manage Pathshala students, attendance, guardians, and subject focus."
      tabs={[
        { id: '/institutions/derasar', label: 'Derasar' },
        { id: '/institutions/pathshala', label: 'Pathshala' },
        { id: '/institutions/aayambil', label: 'Aayambil Shala' },
        { id: '/institutions/upasray', label: 'Upasray' },
      ]}
      activeTab={location.pathname}
      onTabChange={(tabId) => navigate(tabId)}
      breadcrumbs={[{ label: 'Pathshala' }, { label: 'Students' }]}
      action={<Button icon={Plus}>Add Student</Button>}
      stats={stats}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search student, batch, guardian, or subject..."
      isEmpty={!filtered.length}
      emptyState={<EmptyState message="No students found" description="Add Pathshala students to manage batches and attendance." icon={GraduationCap} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(function(item, index) {
          return (
            <CommonCard
              key={item.id}
              icon={GraduationCap}
              iconWrapperClassName="bg-teal-50 border-teal-100"
              iconClassName="text-teal-600"
              accentClassName="bg-teal-500"
              title={item.name}
              subtitle={`${item.standard} - ${item.subject}`}
              status={item.status}
              meta={[
                { value: `Guardian: ${item.guardian}` },
                { value: `Attendance: ${item.attendance}%`, className: 'text-teal-600 font-bold' },
              ]}
              footerLeft={<span className="text-[11px] font-bold text-slate-400">Student Record</span>}
              index={index}
            />
          )
        })}
      </div>
    </CommonPageLayout>
  )
}
