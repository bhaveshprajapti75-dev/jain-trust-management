import { useMemo, useState } from 'react'
import { TrendingDown, Receipt, Plus } from 'lucide-react'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import CommonCard from '../../components/ui/CommonCard'
import CommonPageLayout from '../../components/ui/CommonPageLayout'

const DATA = [
  { id: 1, head: 'Maintenance', source: 'Adinath Derasar', amount: '?52,000', date: '2026-04-02', status: 'Active' },
  { id: 2, head: 'Teacher Honorarium', source: 'Pathshala Department', amount: '?28,000', date: '2026-04-05', status: 'Active' },
  { id: 3, head: 'Festival Arrangement', source: 'Committee', amount: '?71,000', date: '2026-03-29', status: 'Inactive' },
]

export default function Expense() {
  const [search, setSearch] = useState('')
  const filtered = useMemo(function() {
    return DATA.filter(function(item) {
      const query = search.toLowerCase()
      return !query || [item.head, item.source, item.amount, item.date].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
    })
  }, [search])

  return (
    <CommonPageLayout
      title="Expense"
      subtitle="Track expenses, spending heads, and sangh department outflow."
      stats={[
        { title: 'Expense Entries', value: DATA.length, icon: Receipt, color: 'teal' },
        { title: 'Active Entries', value: DATA.filter(function(item) { return item.status === 'Active' }).length, icon: TrendingDown, color: 'emerald' },
        { title: 'Monthly Total', value: '?1.51L', icon: TrendingDown, color: 'sky' },
        { title: 'Expense Heads', value: new Set(DATA.map(function(item) { return item.head })).size, icon: Receipt, color: 'amber' },
      ]}
      action={<Button icon={Plus}>Add Expense</Button>}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search expense head, source, amount, or date..."
      isEmpty={!filtered.length}
      emptyState={<EmptyState message="No expense entries found" description="Add an expense entry to start tracking spending patterns." icon={TrendingDown} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(function(item, index) {
          return (
            <CommonCard
              key={item.id}
              icon={TrendingDown}
              iconWrapperClassName="bg-rose-50 border-rose-100"
              iconClassName="text-rose-600"
              accentClassName="bg-rose-500"
              title={item.head}
              subtitle={item.source}
              status={item.status}
              meta={[
                { value: `Amount: ${item.amount}`, className: 'text-teal-600 font-bold' },
                { value: `Date: ${item.date}` },
              ]}
              footerLeft={<span className="text-[11px] font-bold text-slate-400">Expense Register</span>}
              index={index}
            />
          )
        })}
      </div>
    </CommonPageLayout>
  )
}
