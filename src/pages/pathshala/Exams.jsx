import { useMemo, useState } from 'react'
import { ClipboardList, CalendarClock, BookOpen, Plus } from 'lucide-react'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import CommonCard from '../../components/ui/CommonCard'
import CommonPageLayout from '../../components/ui/CommonPageLayout'

const DATA = [
  { id: 1, examName: 'Paryushan Oral Test', batch: 'Junior A', subject: 'Jain Tatva', examDate: '2026-08-25', mode: 'Offline', status: 'Pending' },
  { id: 2, examName: 'Navkar Quiz', batch: 'Bal Varg 2', subject: 'Pratikraman', examDate: '2026-09-03', mode: 'Written', status: 'Pending' },
  { id: 3, examName: 'Shastra Viva', batch: 'Senior', subject: 'Acharang', examDate: '2026-03-20', mode: 'Oral', status: 'Active' },
]

export default function Exams() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(function() {
    return DATA.filter(function(item) {
      const query = search.toLowerCase()
      return !query || [item.examName, item.batch, item.subject, item.mode, item.examDate].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
    })
  }, [search])

  const stats = useMemo(function() {
    const pending = DATA.filter(function(item) { return item.status === 'Pending' }).length
    const running = DATA.filter(function(item) { return item.status === 'Active' }).length
    return [
      { title: 'Exams', value: DATA.length, icon: ClipboardList, color: 'teal' },
      { title: 'Scheduled', value: pending, icon: CalendarClock, color: 'emerald' },
      { title: 'Running', value: running, icon: BookOpen, color: 'sky' },
      { title: 'Batches', value: new Set(DATA.map(function(item) { return item.batch })).size, icon: BookOpen, color: 'amber' },
    ]
  }, [])

  return (
    <CommonPageLayout
      title="Exams"
      subtitle="Schedule Pathshala exams, batch planning, and assessment mode tracking."
      breadcrumbs={[{ label: 'Pathshala' }, { label: 'Exams' }]}
      action={<Button icon={Plus}>Create Exam</Button>}
      stats={stats}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search exam, batch, subject, mode, or date..."
      isEmpty={!filtered.length}
      emptyState={<EmptyState message="No exams scheduled" description="Create an exam to start planning assessments for each batch." icon={ClipboardList} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(function(item, index) {
          return (
            <CommonCard
              key={item.id}
              icon={ClipboardList}
              iconWrapperClassName="bg-sky-50 border-sky-100"
              iconClassName="text-sky-600"
              accentClassName="bg-sky-500"
              title={item.examName}
              subtitle={`${item.batch} - ${item.subject}`}
              status={item.status}
              meta={[
                { value: `Date: ${item.examDate}` },
                { value: `Mode: ${item.mode}`, className: 'text-teal-600 font-bold' },
              ]}
              footerLeft={<span className="text-[11px] font-bold text-slate-400">Assessment Plan</span>}
              index={index}
            />
          )
        })}
      </div>
    </CommonPageLayout>
  )
}
