import { useMemo, useState } from 'react'
import { TrendingUp, Receipt, Plus } from 'lucide-react'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import CommonCard from '../../components/ui/CommonCard'
import CommonPageLayout from '../../components/ui/CommonPageLayout'

const DATA = [
  { id: 1, head: 'General Donation', source: 'Sathandji Kalyanji Sangh', amount: '?1,25,000', date: '2026-04-01', status: 'Active' },
  { id: 2, head: 'Pathshala Fees', source: 'Bhavnagar Upashray Sangh', amount: '?48,000', date: '2026-04-03', status: 'Active' },
  { id: 3, head: 'Derasar Seva', source: 'Taleti Jain Sangh', amount: '?18,500', date: '2026-03-28', status: 'Inactive' },
]

export default function Income() {
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
      title="Income"
      subtitle="Review income entries across trust and sangh account heads."
      stats={[
        { title: 'Income Entries', value: DATA.length, icon: Receipt, color: 'teal' },
        { title: 'Active Entries', value: DATA.filter(function(item) { return item.status === 'Active' }).length, icon: TrendingUp, color: 'emerald' },
        { title: 'Monthly Total', value: '?1.91L', icon: TrendingUp, color: 'sky' },
        { title: 'Sources', value: new Set(DATA.map(function(item) { return item.source })).size, icon: Receipt, color: 'amber' },
      ]}
      action={<Button icon={Plus}>Add Income</Button>}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search income head, source, amount, or date..."
      isEmpty={!filtered.length}
      emptyState={<EmptyState message="No income entries found" description="Add an income entry to track donations and receipts." icon={TrendingUp} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(function(item, index) {
          return (
            <CommonCard
              key={item.id}
              icon={TrendingUp}
              iconWrapperClassName="bg-emerald-50 border-emerald-100"
              iconClassName="text-emerald-600"
              accentClassName="bg-emerald-500"
              title={item.head}
              subtitle={item.source}
              status={item.status}
              meta={[
                { value: `Amount: ${item.amount}`, className: 'text-teal-600 font-bold' },
                { value: `Date: ${item.date}` },
              ]}
              footerLeft={<span className="text-[11px] font-bold text-slate-400">Income Register</span>}
              index={index}
            />
          )
        })}
      </div>
    </CommonPageLayout>
  )
}
