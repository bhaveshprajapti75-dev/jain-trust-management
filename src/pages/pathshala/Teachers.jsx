import { useMemo, useState } from 'react'
import { BookOpen, Users, GraduationCap, Plus } from 'lucide-react'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import CommonCard from '../../components/ui/CommonCard'
import CommonPageLayout from '../../components/ui/CommonPageLayout'

const DATA = [
  { id: 1, name: 'Hemant Joshi', batch: 'Junior A', subject: 'Jain Tatva', experience: '10 Years', students: 34, status: 'Active' },
  { id: 2, name: 'Milan Shah', batch: 'Bal Varg 2', subject: 'Stavan', experience: '7 Years', students: 26, status: 'Active' },
  { id: 3, name: 'Rina Mehta', batch: 'Senior', subject: 'Pratikraman', experience: '4 Years', students: 18, status: 'Inactive' },
]

export default function Teachers() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(function() {
    return DATA.filter(function(item) {
      const query = search.toLowerCase()
      return !query || [item.name, item.batch, item.subject, item.experience].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
    })
  }, [search])

  const stats = useMemo(function() {
    const active = DATA.filter(function(item) { return item.status === 'Active' }).length
    const students = DATA.reduce(function(sum, item) { return sum + item.students }, 0)
    return [
      { title: 'Teachers', value: DATA.length, icon: GraduationCap, color: 'teal' },
      { title: 'Active Faculty', value: active, icon: Users, color: 'emerald' },
      { title: 'Student Coverage', value: students, icon: BookOpen, color: 'sky' },
      { title: 'Batches', value: new Set(DATA.map(function(item) { return item.batch })).size, icon: BookOpen, color: 'amber' },
    ]
  }, [])

  return (
    <CommonPageLayout
      title="Teachers"
      subtitle="Manage Pathshala teachers, subject allocation, and batch ownership."
      breadcrumbs={[{ label: 'Pathshala' }, { label: 'Teachers' }]}
      action={<Button icon={Plus}>Add Teacher</Button>}
      stats={stats}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search teacher, batch, subject, or experience..."
      isEmpty={!filtered.length}
      emptyState={<EmptyState message="No teachers found" description="Add teaching staff to assign classes and subjects." icon={GraduationCap} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(function(item, index) {
          return (
            <CommonCard
              key={item.id}
              icon={GraduationCap}
              iconWrapperClassName="bg-emerald-50 border-emerald-100"
              iconClassName="text-emerald-600"
              accentClassName="bg-emerald-500"
              title={item.name}
              subtitle={`${item.batch} - ${item.subject}`}
              status={item.status}
              meta={[
                { value: `Experience: ${item.experience}` },
                { value: `${item.students} Students`, className: 'text-teal-600 font-bold' },
              ]}
              footerLeft={<span className="text-[11px] font-bold text-slate-400">Teaching Assignment</span>}
              index={index}
            />
          )
        })}
      </div>
    </CommonPageLayout>
  )
}
