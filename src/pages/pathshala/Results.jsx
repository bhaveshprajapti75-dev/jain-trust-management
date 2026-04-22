import { useMemo, useState } from 'react'
import { BarChart3, Award, BookOpen } from 'lucide-react'
import EmptyState from '../../components/ui/EmptyState'
import CommonCard from '../../components/ui/CommonCard'
import CommonPageLayout from '../../components/ui/CommonPageLayout'

const DATA = [
  { id: 1, student: 'Aarav Shah', exam: 'Monthly Jan', marks: 95, total: 100, grade: 'A+', status: 'Passed' },
  { id: 2, student: 'Kavya Mehta', exam: 'Navkar Quiz', marks: 87, total: 100, grade: 'A', status: 'Passed' },
  { id: 3, student: 'Krish Doshi', exam: 'Shastra Viva', marks: 43, total: 100, grade: 'C', status: 'Failed' },
]

export default function Results() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(function() {
    return DATA.filter(function(item) {
      const query = search.toLowerCase()
      return !query || [item.student, item.exam, item.grade, item.status].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
    })
  }, [search])

  const stats = useMemo(function() {
    const passed = DATA.filter(function(item) { return item.status === 'Passed' }).length
    const topScore = Math.max.apply(null, DATA.map(function(item) { return item.marks }))
    return [
      { title: 'Results', value: DATA.length, icon: BarChart3, color: 'teal' },
      { title: 'Passed', value: passed, icon: Award, color: 'emerald' },
      { title: 'Pass Rate', value: Math.round((passed / DATA.length) * 100) + '%', icon: BookOpen, color: 'sky' },
      { title: 'Top Marks', value: topScore + '/100', icon: Award, color: 'amber' },
    ]
  }, [])

  return (
    <CommonPageLayout
      title="Results"
      subtitle="Track Pathshala exam performance, grades, and result publication status."
      breadcrumbs={[{ label: 'Pathshala' }, { label: 'Results' }]}
      stats={stats}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search student, exam, grade, or result status..."
      isEmpty={!filtered.length}
      emptyState={<EmptyState message="No results found" description="Publish an exam result to start performance tracking." icon={BarChart3} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(function(item, index) {
          return (
            <CommonCard
              key={item.id}
              icon={BarChart3}
              iconWrapperClassName="bg-teal-50 border-teal-100"
              iconClassName="text-teal-600"
              accentClassName="bg-teal-500"
              title={item.student}
              subtitle={`${item.exam} - Grade ${item.grade}`}
              status={item.status}
              meta={[
                { value: `Marks: ${item.marks}/${item.total}`, className: 'text-teal-600 font-bold' },
                { value: `Grade: ${item.grade}` },
              ]}
              footerLeft={<span className="text-[11px] font-bold text-slate-400">Published Result</span>}
              index={index}
            />
          )
        })}
      </div>
    </CommonPageLayout>
  )
}
